jQuery(document).ready(function ($) {
    let $body = $('body')
    let $window = $(window)

    //* DUCK HUNT
    function duckhunt() {
        const duckhunt = `
            <div class="dh_game">
                <div class="dh_game__name">DUCK HUNT</div>
                <div class="dh_game__duck"></div>
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
                    <button class="dh_gameover__button">Close game</button>
                </div>
                <div class="dh_gameover__dog"></div>
            </div>
        `

        $body.prepend(duckhunt)

        let aim = document.querySelector('.dh_game__aim')
        let title = document.querySelector('.dh_game__name')
        let duck = document.querySelector('.dh_game__duck')
        let duckWidth = duck.offsetWidth
        let duckHeight = duck.offsetHeight
        let windowWidth = window.innerWidth
        let windowHeight = window.innerHeight
        let duckX = Math.floor(Math.random() * (windowWidth - duckWidth))
        let duckY = Math.floor(Math.random() * (windowHeight - duckHeight))
        let duckDirectionX = Math.floor(Math.random() * 2) === 0 ? -1 : 1
        let duckDirectionY = Math.floor(Math.random() * 2) === 0 ? -1 : 1
        let duckSpeed = 3
        let score = 0
        let scoreElement = document.querySelector('.score')
        let maxBullets = 3
        let consecutiveDucks = 0

        duck.style.left = duckX + 'px'
        duck.style.top = duckY + 'px'

        /* CURSOR */
        document.addEventListener('mousemove', function (e) {
            aim.style.left = e.clientX + 'px'
            aim.style.top = e.clientY + 'px'
        })

        /* BULLETS */
        for (let i = 0; i < maxBullets; i++) {
            let bullet = document.createElement('span')
            bullet.classList.add('bullet')
            document.querySelector('.dh_game__bullets').appendChild(bullet)
        }

        /* DUCK MOVEMENT */
        setInterval(function () {
            duckX += duckSpeed * duckDirectionX
            duckY += duckSpeed * duckDirectionY

            if (duckX < 0) {
                duckDirectionX = Math.random() * (1 - 0.1) + 0.1
                duckSpeed += 0.015
            } else if (duckX > windowWidth - duckWidth) {
                duckDirectionX = Math.random() * (-1 - -0.1) + -0.1
                duckSpeed += 0.015
            }

            if (duckY < 0) {
                duckDirectionY = Math.random() * (1 - 0.1) + 0.1
                duckSpeed += 0.015
            } else if (duckY > windowHeight - duckHeight) {
                duckDirectionY = Math.random() * (-1 - -0.1) + -0.1
                duckSpeed += 0.015
            }

            duck.style.left = duckX + 'px'
            duck.style.top = duckY + 'px'

            /* DUCK FLIPPED */
            if (duckDirectionX < 0) {
                duck.classList.add('dh_game__duck--flipped')
            } else if (!duck.classList.contains('dh_game__duck--dead')) {
                duck.classList.remove('dh_game__duck--flipped')
            }
        }, 10)

        /* MISSED THE DUCK */
        document
            .querySelector('.dh_game')
            .addEventListener('click', function (e) {
                if (e.target !== duck) {
                    let bullets = document.querySelectorAll(
                        '.dh_game__bullets span',
                    )

                    bullets[0].remove()

                    title.classList.add('flash-lose')

                    duckSpeed -= 1

                    if (duckSpeed < 1) {
                        duckSpeed = 1
                    }

                    setTimeout(function () {
                        title.classList.remove('flash-lose')
                    }, 500)

                    if (bullets.length === 1) {
                        endGame()
                    }

                    consecutiveDucks = 0
                }
            })

        /* DUCK FIRE */
        duck.addEventListener('click', function () {
            duckDirectionX = 0
            duckDirectionY = 0

            duck.classList.add('dh_game__duck--dead')
            title.classList.add('flash-win')

            /* FLASH TITLE */
            setTimeout(function () {
                title.classList.remove('flash-win')
            }, 500)

            /* FADE DUCK AND SPAWN ANOTHER*/
            setTimeout(function () {
                duck.classList.add('dh_game__duck--faded')

                setTimeout(function () {
                    spawnDuck()
                }, 1000)
            }, 300)

            /* ADJUST SCORE */
            score++
            scoreElement.innerHTML = score

            /* GIVE BULLETS FOR CONSECUTIVE SHOTS */
            consecutiveDucks += 1
            if (consecutiveDucks === 10 && $('.bullet').length < maxBullets) {
                let bullet = document.createElement('span')
                bullet.classList.add('bullet')
                document.querySelector('.dh_game__bullets').appendChild(bullet)
                consecutiveDucks = 0

                title.classList.add('flash-bullet')
            }
        })

        function spawnDuck() {
            duckX = Math.floor(Math.random() * (windowWidth - duckWidth))
            duckY = Math.floor(Math.random() * (windowHeight - duckHeight))
            duckDirectionX = Math.floor(Math.random() * 2) === 0 ? -1 : 1
            duckDirectionY = Math.floor(Math.random() * 2) === 0 ? -1 : 1

            duck.style.left = duckX + 'px'
            duck.style.top = duckY + 'px'

            duck.classList.remove('dh_game__duck--dead')
            duck.classList.remove('dh_game__duck--faded')

            title.classList.remove('flash-win')
            title.classList.remove('flash-bullet')

            duckSpeed += 0.15

            if (duckSpeed < 4) {
                duckSpeed = 4
            }
            if (duckSpeed > 20) {
                duckSpeed = 20
            }
        }

        function endGame() {
            $body.prepend(gameOver)

            let scoreElement = document.querySelector('.dh_gameover .endScore')
            let button = document.querySelector('.dh_gameover__button')

            scoreElement.innerHTML = score

            button.addEventListener('click', function () {
                document.querySelector('.dh_game').remove()
                document.querySelector('.dh_gameover').remove()
            })
        }
    }

    $window.on('load', function () {
        duckhunt();
    });
});