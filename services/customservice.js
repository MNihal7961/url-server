const generateThreeCharacterString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generateRandomThreeDigitNumber = () => {
    return Math.floor(100 + Math.random() * 900);
};


export const generateRandom15 = () => {
    try {
        let s = "http://localhost:34000/"
        let urls = []
        for (let i = 1; i <= 15; i++) {
            const code = generateThreeCharacterString() + generateRandomThreeDigitNumber()
            urls.push({ url: s + code, code: code })
        }
        return urls
    } catch (error) {
        console.log(error)
    }
}


