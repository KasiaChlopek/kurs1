let active_item = 0

const right_arrow = document.querySelector('.arrow-right')
const container = document.querySelector('.container')
const box = container.children

function setItem() {
   
    for (const )
    box[active_item].style.opacity = 1
}


right_arrow.addEventListener('click', function(){
    active_item++
    if (box.length == active_item)
    setItem()

})
setItem()




console.log ('active_item', active_item)