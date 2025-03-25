const right_arrow = document.querySelector('.arrrow-right')
let active_item = 0
const container = document.querySelector('.container')
const box = container.children

function setItem () {
    box [active_item].style.opacity = 1
}


right_arrow.addEventListener('click', function(){
    active_item++
    setItem ()

})
setItem ()




console.log ('active_item', active_item)1