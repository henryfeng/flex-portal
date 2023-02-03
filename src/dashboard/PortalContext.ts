export default class PortalContext {

    #board: any

    constructor(board: any) {
        this.#board = board;
    }

    get board():any {
        return this.#board;
    }

    openFrameDialog(url: string, callback: (mr)=>{}):any {
        this.#board.openFrameDialog(url, callback);
    }

    openComponentDialog (code: string, title: string, params: any, style: string = 'width: 80%; height: 80%') {
        this.#board.openComponentDialog(code, title, params, style);
    }
}