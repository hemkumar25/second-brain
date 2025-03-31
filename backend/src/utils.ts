export function random(len : number){
    let options = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let length =options.length;
    let ans = " "
    for(let i=0; i<len; i++){
        ans+=options[Math.floor((Math.random() *length))] //0 => 20
    }

    return ans;
}