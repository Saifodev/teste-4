let clientId
let gameId
let isTurn = false
let yourSymbol
let socket;
let board;
let game
let check
let boolen
let counter
const connectBtn = document.getElementById('connectBtn')
const newGameBtn = document.getElementById('newGame')
const currGames = document.getElementById('currGames')
const joinGame = document.querySelector('button[type="submit"]')
const cells = document.querySelectorAll('#cell')
const gameBoard = document.querySelector('#board')
const userCol = document.querySelector('.flex-col1')

connectBtn.addEventListener('click', () => {
    connectBtn.disabled = true
    socket = new WebSocket('ws://localhost:8080')
    socket.onopen = function(event) {}
    newGameBtn.addEventListener('click', () => {
        newGameBtn.disabled = true
        const payLoad = {
            'method': 'create',
            'clientId': clientId
        }
        socket.send(JSON.stringify(payLoad))
    })

    socket.onmessage = function(msg) {
        const data = JSON.parse(msg.data)
        switch (data.method) {
            case 'connect':
                clientId = data.clientId
                userCol.innerHTML = `ID: ${clientId}`
                userCol.classList.add('joinLabel')
                
                break;
            case 'create':
                // inform you have successfully created the game and been added as player1
                gameId = data.game.gameId
                yourSymbol = data.game.players[0].symbol
                document.querySelector('.sidebar ul li').innerHTML = gameId
                document.querySelector('.yoursimbol').innerHTML = yourSymbol
                console.log(`game id is ${gameId} and your symbol is ${yourSymbol}`)
                cells.forEach(cell => {
                    cell.classList.remove('x')
                    cell.classList.remove('cirlce')
                })
                break

             /*  case 'gamesAvail':
                while (currGames.firstChild) {
                    currGames.removeChild(currGames.lastChild)
                }
                const games = data.games
                
                games.forEach((game) => {
      
                    const li = document.createElement('li')
                  /*   li.addEventListener('click', selectGame)  
                    li.innerText = game.gameId 
                    currGames.appendChild(li)
                
                })
                break  */
            case 'join':
                
                gameId = data.game.gameId
                yourSymbol = data.game.players[1].symbol
                console.log(`game id is ${gameId} and your symbol is ${yourSymbol}`)
                cells.forEach(cell => {
                    console.log(`cell classes are ${cell.classList}`)
                    cell.classList.remove('x')
                    cell.classList.remove('cirlce')

                })
                break
            case 'updateBoard':
                gameBoard.style.display = "grid"
                console.log(`game updateBoard is ${data.game.board}`)
                game = data.game
                board = game.board
                const symbolClass = yourSymbol == 'x' ? 'x' : 'circle'
                gameBoard.classList.add(symbolClass)
                index = 0
                cells.forEach(cell => {
                    if (board[index] == 'x')
                        cell.classList.add('x')
                    else if (board[index] == 'o')
                        cell.classList.add('circle')
                    else
                        cell.addEventListener('click', clickCell)
                    index++
                })

                game.players.forEach((player) => {
                    if (player.clientId == +clientId && player.isTurn == true) {
                        isTurn = true
                        console.log(`your turn`)
                    }
                })
                break

            case 'gameEnds':
                console.log(`Winner is ${data.winner}`)
                window.alert(`Winner is ${data.winner}`)
                //resfresh()
                break;
            case 'draw':
                alert('Its a draw')
                //resfresh()
                break
        }
    }

    socket.onclose = function(event) {

    }

    socket.onerror = function(err) {

    }
})
function selectGame(src) {   
        gameId = document.querySelector('.inptext').value//+src.target.innerText
        joinGame.addEventListener('click', joingm, { once: true })
        document.querySelector('.sidebar ul li').innerHTML = document.querySelector('.inptext').value
        document.querySelector('.yoursimbol').innerHTML = 'O'
    }

function joingm() {
    const payLoad = {
        'method': 'join',
        'clientId': clientId,
        'gameId': gameId
    }
    socket.send(JSON.stringify(payLoad))
}

function clickCell(event) {
counter = true
    if (!isTurn || event.target.classList.contains('x') || (event.target.classList.contains('circle')))
        return

    const cellclass = yourSymbol == 'x' ? 'x' : 'circle'
    event.target.classList.add(cellclass)

    index = 0
    cells.forEach(cell => {
        if (cell.classList.contains('x'))
            board[index] = 'x'
        if (cell.classList.contains('circle'))
            board[index] = 'o'
        index++
    })
    isTurn = false
    makeMove()
}

function makeMove() {
    index = 0
    cells.forEach((cell) => {
        if (cell.classList.contains('x'))
            game.board[index] == 'x'

        if (cell.classList.contains('circle'))
            game.board[index] == 'o'
        index++
    })
    cells.forEach(cell => cell.removeEventListener('click', clickCell))
    const payLoad = {
        'method': 'makeMove',
        'game': game
    }
    socket.send(JSON.stringify(payLoad))

}
function resfresh(){
    for(let i = 0; i<document.querySelectorAll('.cell').length; i++){
        document.querySelectorAll('.cell')[i].classList.remove('x')
        document.querySelectorAll('.cell')[i].classList.remove('circle')
    }
}