class ChessGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.validMoves = [];
        this.initializeBoard();
        this.setupEventListeners();
    }

    initializeBoard() {
        const initialPosition = [
            ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
            ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
            ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
        ];

        const chessboard = document.querySelector('.chessboard');
        chessboard.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                if (initialPosition[row][col]) {
                    const piece = document.createElement('div');
                    piece.className = 'piece';
                    piece.textContent = initialPosition[row][col];
                    piece.dataset.color = this.getPieceColor(initialPosition[row][col]);
                    square.appendChild(piece);
                }
                
                this.board[row][col] = square;
                chessboard.appendChild(square);
            }
        }
    }

    getPieceColor(piece) {
        const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
        return whitePieces.includes(piece) ? 'white' : 'black';
    }

    setupEventListeners() {
        const chessboard = document.querySelector('.chessboard');
        const resetButton = document.querySelector('.reset-button');

        chessboard.addEventListener('click', (e) => {
            const square = e.target.closest('.square');
            if (!square) return;

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            this.handleSquareClick(row, col);
        });

        resetButton.addEventListener('click', () => {
            this.initializeBoard();
            this.currentPlayer = 'white';
            this.updateCurrentPlayerDisplay();
        });
    }

    handleSquareClick(row, col) {
        const square = this.board[row][col];
        const piece = square.querySelector('.piece');

        if (this.selectedPiece) {
            if (this.isValidMove(row, col)) {
                this.movePiece(row, col);
            }
            this.clearSelection();
        } else if (piece && piece.dataset.color === this.currentPlayer) {
            this.selectPiece(row, col);
        }
    }

    selectPiece(row, col) {
        this.selectedPiece = { row, col };
        this.board[row][col].classList.add('selected');
        this.calculateValidMoves(row, col);
    }

    clearSelection() {
        if (this.selectedPiece) {
            this.board[this.selectedPiece.row][this.selectedPiece.col].classList.remove('selected');
            this.validMoves.forEach(move => {
                this.board[move.row][move.col].classList.remove('valid-move');
            });
            this.selectedPiece = null;
            this.validMoves = [];
        }
    }

    calculateValidMoves(row, col) {
        const piece = this.board[row][col].querySelector('.piece').textContent;
        const moves = [];

        switch (piece) {
            case '♙': // White pawn
                if (row > 0 && !this.board[row - 1][col].querySelector('.piece')) {
                    moves.push({ row: row - 1, col });
                    if (row === 6 && !this.board[row - 2][col].querySelector('.piece')) {
                        moves.push({ row: row - 2, col });
                    }
                }
                // Capture moves
                if (row > 0 && col > 0) {
                    const leftPiece = this.board[row - 1][col - 1].querySelector('.piece');
                    if (leftPiece && leftPiece.dataset.color === 'black') {
                        moves.push({ row: row - 1, col: col - 1 });
                    }
                }
                if (row > 0 && col < 7) {
                    const rightPiece = this.board[row - 1][col + 1].querySelector('.piece');
                    if (rightPiece && rightPiece.dataset.color === 'black') {
                        moves.push({ row: row - 1, col: col + 1 });
                    }
                }
                break;
            case '♟': // Black pawn
                if (row < 7 && !this.board[row + 1][col].querySelector('.piece')) {
                    moves.push({ row: row + 1, col });
                    if (row === 1 && !this.board[row + 2][col].querySelector('.piece')) {
                        moves.push({ row: row + 2, col });
                    }
                }
                // Capture moves
                if (row < 7 && col > 0) {
                    const leftPiece = this.board[row + 1][col - 1].querySelector('.piece');
                    if (leftPiece && leftPiece.dataset.color === 'white') {
                        moves.push({ row: row + 1, col: col - 1 });
                    }
                }
                if (row < 7 && col < 7) {
                    const rightPiece = this.board[row + 1][col + 1].querySelector('.piece');
                    if (rightPiece && rightPiece.dataset.color === 'white') {
                        moves.push({ row: row + 1, col: col + 1 });
                    }
                }
                break;
            // Add more piece movement logic here
        }

        this.validMoves = moves;
        moves.forEach(move => {
            this.board[move.row][move.col].classList.add('valid-move');
        });
    }

    isValidMove(row, col) {
        return this.validMoves.some(move => move.row === row && move.col === col);
    }

    movePiece(toRow, toCol) {
        const fromSquare = this.board[this.selectedPiece.row][this.selectedPiece.col];
        const toSquare = this.board[toRow][toCol];
        const piece = fromSquare.querySelector('.piece');

        // Handle captures
        if (toSquare.querySelector('.piece')) {
            const capturedPiece = toSquare.querySelector('.piece');
            const capturedContainer = document.querySelector(
                `.${this.currentPlayer === 'white' ? 'white' : 'black'}-captured`
            );
            capturedContainer.appendChild(capturedPiece);
        }

        // Move the piece
        toSquare.appendChild(piece);
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateCurrentPlayerDisplay();
    }

    updateCurrentPlayerDisplay() {
        const display = document.querySelector('.current-player');
        display.textContent = `Current Player: ${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});
