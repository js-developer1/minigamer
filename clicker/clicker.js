import itemData from './itemData.json' assert {type: 'json'}

const computer = document.querySelector("#clicker")
const coinsDisplay = document.querySelector('#coins')
const cpsDisplay = document.querySelector("#clicksPerSecond")
const multiplierDisplay = document.querySelector("#multiplier")

let { coins, cps, multiplier, cpsBought, multipliersBought } = JSON.parse(localStorage.getItem("minigamerStats")).clicker || 0
let cpsTimer = 0
displayStats()
initShop()

computer.onclick = () => {
    coins++;
    displayStats()
}

setInterval(() => {
    cpsTimer += parseInt(cps) / 1000
    coins = parseInt(coins) + Math.floor(cpsTimer)
    for (let i = 0; i < itemData.length; i++) {
        const item = itemData[i];
        const itemPriceElem = document.getElementById("cost")
        itemPriceElem.innerHTML = `$${actualPrice(item)}`
    }
    if(cpsTimer > 1) cpsTimer = 0
    displayStats()
}, 1)

function displayStats() {
    coinsDisplay.innerHTML = `$${coins}`
    cpsDisplay.innerHTML = `${cps}cps`
    multiplierDisplay.innerHTML = `${multiplier}x`
    
    const gameData = {
            'pong': JSON.stringify(localStorage.getItem("minigamerStats")).pong,
            'clicker': {
                'coins': coins,
                'cps': cps,
                'multiplier': multiplier,
                'cpsBought': cpsBought,
                'multipliersBought': multipliersBought
            },
            'flappyBird': JSON.stringify(localStorage.getItem("minigamerStats")).flappyBird
    }

    localStorage.setItem('minigamerStats', JSON.stringify(gameData))
}

function actualPrice(item) {
    const priceIncrease = parseFloat(item.priceIncrease)
    let price = parseInt(item.origPrice);
    if(item.itemType == "cps") {
        for (let i = 0; i < cpsBought; i++) {
            price = price + price * priceIncrease
        }
    } else {
        for (let i = 0; i < multipliersBought; i++) {
            price = price + price * priceIncrease
        }
    }
    price = Math.round(price * 100) / 100
    return price
}

function buyitem(itemNum) {
    const item = itemData[itemNum]
    const cost = actualPrice(item)
    if(coins <= cost) return
    if(item.itemType == "cps") {
        cpsBought++;
    } else if(item.itemType == "multiplier") {
        multipliersBought++;
    }
    coins -= cost
    cps = parseInt(cps) + parseInt(item.cpsIncrease)
    multiplier = parseInt(multiplier) +  parseInt(item.multiplierIncrease)
    displayStats()
    alert(`You just bought ${item.name} for $${cost}.`)
}

function initShop() {
    const shopButtons = document.querySelectorAll('.shopItem')
    for (let i = 0; i < shopButtons.length; i++) {
        const shopButton = shopButtons[i];
        shopButton.onclick = () => {
            buyitem(i)
        }
    }
}