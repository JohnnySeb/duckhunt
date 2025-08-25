jQuery(document).ready(function ($) {
    let $body = $('body')
    let $window = $(window)

    function duckhunt() {
        const duckhunt = `
            <div class="dh_game">
                <div class="dh_game__name">DUCK HUNT</div>
                <div class="dh_game__aim"></div>
                <div class="dh_game__mainScore">Score: <span class="score">0</span></div>
                <div class="dh_game__bullets"></div>
            </div>
        `
        const gameOver = `
            <div class="dh_gameover">
                <div class="dh_gameover__content">
                    <h1>GAME OVER</h1>
                    <h5>No bullet left!</h5>
                    <p class="dh_gameover__endScoreContainer">Score: <span class="endScore"></span></p>
                    <button class="dh_gameover__button">Play again</button>
                </div>
                <div class="dh_gameover__dog"></div>
            </div>
        `
        $body.prepend(duckhunt)

        let aim = document.querySelector('.dh_game__aim')
        let title = document.querySelector('.dh_game__name')
        let scoreElement = document.querySelector('.score')
        let maxBullets = 3
        let consecutiveDucks = 0
        let score = 0
        let duckSpeed = 3
        let ducks = []
        let duckIntervals = []
        let duckTimers = []
        let duckEscaping = []
        let duckEscapeDir = []
        let duckDead = []
        let duckFaded = []
        let duckElements = []
        let duckCount = 1

        // Ajout initial des balles
        for (let i = 0; i < maxBullets; i++) {
            let bullet = document.createElement('span')
            bullet.classList.add('bullet')
            document.querySelector('.dh_game__bullets').appendChild(bullet)
        }

        // Ajoute un canard (index = 0 pour le premier, 1 pour le deuxième, etc.)
        function addDuck(index) {
            let duck = document.createElement('div')
            duck.className = 'dh_game__duck' + (index > 0 ? ` dh_game__duck--${index+1}` : '')
            document.querySelector('.dh_game').appendChild(duck)
            let duckWidth = duck.offsetWidth
            let duckHeight = duck.offsetHeight
            let windowWidth = window.innerWidth
            let windowHeight = window.innerHeight
            let duckX = Math.floor(Math.random() * (windowWidth - duckWidth))
            let duckY = Math.floor(Math.random() * (windowHeight - duckHeight))
            let duckDirectionX = Math.floor(Math.random() * 2) === 0 ? -1 : 1
            let duckDirectionY = Math.floor(Math.random() * 2) === 0 ? -1 : 1

            duck.style.left = duckX + 'px'
            duck.style.top = duckY + 'px'

            ducks[index] = { 
                el: duck, width: duckWidth, height: duckHeight, 
                x: duckX, y: duckY, dx: duckDirectionX, dy: duckDirectionY 
            }
            duckEscaping[index] = false
            duckEscapeDir[index] = {dx: 0, dy: 0}
            duckDead[index] = false
            duckFaded[index] = false
            duckElements[index] = duck

            // Mouvement du canard
            duckIntervals[index] = setInterval(function () {
                let d = ducks[index]
                if (!d) return
                if (duckEscaping[index]) {
                    d.x += duckSpeed * 2 * duckEscapeDir[index].dx
                    d.y += duckSpeed * 2 * duckEscapeDir[index].dy
                    d.el.style.left = d.x + 'px'
                    d.el.style.top = d.y + 'px'
                    if (
                        d.x < -d.width ||
                        d.x > window.innerWidth + d.width ||
                        d.y < -d.height ||
                        d.y > window.innerHeight + d.height
                    ) {
                        duckEscaping[index] = false
                    }
                    return
                }
                d.x += duckSpeed * d.dx
                d.y += duckSpeed * d.dy
                if (d.x < 0) {
                    d.dx = Math.random() * (1 - 0.1) + 0.1
                    duckSpeed += 0.015
                } else if (d.x > windowWidth - d.width) {
                    d.dx = Math.random() * (-1 - -0.1) + -0.1
                    duckSpeed += 0.015
                }
                if (d.y < 0) {
                    d.dy = Math.random() * (1 - 0.1) + 0.1
                    duckSpeed += 0.015
                } else if (d.y > windowHeight - d.height) {
                    d.dy = Math.random() * (-1 - -0.1) + -0.1
                    duckSpeed += 0.015
                }
                d.el.style.left = d.x + 'px'
                d.el.style.top = d.y + 'px'
                if (d.dx < 0) {
                    d.el.classList.add('dh_game__duck--flipped')
                } else if (!d.el.classList.contains('dh_game__duck--dead')) {
                    d.el.classList.remove('dh_game__duck--flipped')
                }
            }, 10)

            // Timer du canard
            startDuckTimer(index)

            // Click sur le canard
            duck.addEventListener('click', function (e) {
                if (duckEscaping[index] || duckDead[index]) return
                clearTimeout(duckTimers[index])
                ducks[index].dx = 0
                ducks[index].dy = 0
                duck.classList.add('dh_game__duck--dead')
                duckDead[index] = true
                title.classList.add('flash-win')

                setTimeout(function () {
                    title.classList.remove('flash-win')
                }, 500)

                setTimeout(function () {
                    duck.classList.add('dh_game__duck--faded')
                    duckFaded[index] = true
                    setTimeout(function () {
                        spawnDuck(index)
                    }, 1000)
                }, 300)
                
                score++
                scoreElement.innerHTML = score
                consecutiveDucks += 1
                if (consecutiveDucks === 10 && $('.bullet').length < maxBullets) {
                    let bullet = document.createElement('span')
                    bullet.classList.add('bullet')
                    document.querySelector('.dh_game__bullets').appendChild(bullet)
                    consecutiveDucks = 0
                    title.classList.add('flash-bullet')
                }

                // Ajout du 2e canard à 10 points
                if (score === 10 && duckCount === 1) {
                    duckCount = 2
                    addDuck(1)
                }
            })
        }

        function startDuckTimer(index) {
            clearTimeout(duckTimers[index])
            duckTimers[index] = setTimeout(function () {
                duckEscaping[index] = true
                let d = ducks[index]
                let norm = Math.sqrt(d.dx * d.dx + d.dy * d.dy)
                duckEscapeDir[index] = {dx: d.dx / (norm || 1), dy: d.dy / (norm || 1)}
                title.textContent = "MISSED"
                title.classList.add('flash-lose')
                let bullets = document.querySelectorAll('.dh_game__bullets span')
                if (bullets.length > 0) {
                    bullets[0].remove()
                }
                setTimeout(function () {
                    title.classList.remove('flash-lose')
                    title.textContent = "DUCK HUNT"
                    if (document.querySelectorAll('.dh_game__bullets span').length === 0) {
                        endGame()
                    } else {
                        spawnDuck(index)
                    }
                }, 1200)
            }, 7000)
        }

        function spawnDuck(index) {
            let d = ducks[index]
            let windowWidth = window.innerWidth
            let windowHeight = window.innerHeight
            d.x = Math.floor(Math.random() * (windowWidth - d.width))
            d.y = Math.floor(Math.random() * (windowHeight - d.height))
            d.dx = Math.floor(Math.random() * 2) === 0 ? -1 : 1
            d.dy = Math.floor(Math.random() * 2) === 0 ? -1 : 1
            d.el.style.left = d.x + 'px'
            d.el.style.top = d.y + 'px'
            d.el.classList.remove('dh_game__duck--dead')
            d.el.classList.remove('dh_game__duck--faded')
            title.classList.remove('flash-win')
            title.classList.remove('flash-bullet')
            duckSpeed += 0.15
            if (duckSpeed < 4) duckSpeed = 4
            if (duckSpeed > 20) duckSpeed = 20
            duckEscaping[index] = false
            duckDead[index] = false
            duckFaded[index] = false
            startDuckTimer(index)
        }

        // Initialisation du premier canard
        addDuck(0)

        // Gestion du curseur
        document.addEventListener('mousemove', function (e) {
            aim.style.left = e.clientX + 'px'
            aim.style.top = e.clientY + 'px'
        })

        // Gestion du clic manqué (hors canard)
        document.querySelector('.dh_game').addEventListener('click', function (e) {
            // Si le clic n'est sur aucun canard et qu'aucun n'est en escape
            let missed = true
            for (let i = 0; i < duckCount; i++) {
                if (e.target === duckElements[i] || duckEscaping[i]) missed = false
            }
            if (!missed) return
            let bullets = document.querySelectorAll('.dh_game__bullets span')
            if (bullets.length > 0) bullets[0].remove()
            title.classList.add('flash-lose')
            duckSpeed -= 1
            if (duckSpeed < 1) duckSpeed = 1
            setTimeout(function () {
                title.classList.remove('flash-lose')
            }, 500)
            if (bullets.length === 1) {
                endGame()
            }
            consecutiveDucks = 0
        })

        function endGame() {
            duckTimers.forEach(t => clearTimeout(t))
            duckIntervals.forEach(i => clearInterval(i))
            $body.prepend(gameOver)
            let scoreElement = document.querySelector('.dh_gameover .endScore')
            let button = document.querySelector('.dh_gameover__button')
            scoreElement.innerHTML = score
            button.addEventListener('click', function () {
                location.reload()
            })
        }
    }

    $window.on('load', function () {
        duckhunt();
    });
});