// import * as crypto from "crypto" -> esModuleInterop 옵션 false일 경우
import crypto from "crypto"; // @type/node에 정의 파일 존재

interface BlockShape {
    hash: string;
    prevHash: string;
    height: number;
    data: string;
}

class Block implements BlockShape {
    public hash: string;
    constructor(
        public prevHash: string,
        public height: number,
        public data: string
    ) {
        this.hash = Block.calculateHash(prevHash, height, data);
    }

    static calculateHash(prevHash: string, height: number, data: string) {
        const toHash = `${prevHash}${height}${data}`;

        return crypto.createHash("sha256").update(toHash).digest("hex");
    }
}

class Blockchain {
    private blocks: Block[];
    constructor() {
        this.blocks = [];
    }

    private getPrevHash() {
        if (this.blocks.length === 0) return "";
        return this.blocks[this.blocks.length - 1].hash;
    }

    public addBlock(data: string) {
        const newBlock = new Block(
            this.getPrevHash(),
            this.blocks.length + 1,
            data
        );
        this.blocks.push(newBlock);
    }

    public getBlocks() {
        // 신규 배열을 리턴, 원본 blockchain 배열을 건드릴 수 없게끔 보안!
        return [...this.blocks];
    }
}

const blockchain = new Blockchain();

blockchain.addBlock("first");
blockchain.addBlock("second");
blockchain.addBlock("third");

// 원본 배열이 보호되었기 때문에 변화 없음
blockchain.getBlocks().push(new Block("xxxxx", 1111111, "HACKEDDDDDD zzzz"));

console.log(blockchain.getBlocks());
