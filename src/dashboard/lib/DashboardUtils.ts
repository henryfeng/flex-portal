import type {Frame} from "../../lib/Template";

const checkOverloop = (frames: Array<Frame>): boolean => {
    for(let i=0;i<frames.length-1;i++){
        for(let x=i+1;x<frames.length;x++){
            // i在x的左边，且i的右边缘在x左边缘的右边，水平方向上冲突
            let leftErr = frames[i].posX < frames[x].posX && frames[i].width+frames[i].posX > frames[x].posX;
            // i在x的右边，且i的右边缘在x右边缘的左边，水平方向上冲突
            let rightErr = frames[i].posX > frames[x].posX && frames[i].posX < frames[x].posX + frames[x].width;
            if(leftErr || rightErr){
                let topErr = frames[i].posY < frames[x].posY && frames[i].posY + frames[i].height > frames[x].posY;
                let bottonErr = frames[i].posY > frames[x].posY && frames[i].posY < frames[x].posY + frames[x].height;
                if(topErr || bottonErr){
                    return true;
                }
            }
        }
    }
    return false;
}



export default {checkOverloop}