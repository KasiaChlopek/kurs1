const gameplane = document.querySelector('.gameplane')
const pierog = gameplane.querySelector('.pierog')
const lives = gameplane.querySelector('.lives')
const start_button = gameplane.querySelector('#start_button')
const restart_button = gameplane.querySelector('#restart_button')
const game_intro_modal = gameplane.querySelector('.game-intro-modal')
const game_over_modal = gameplane.querySelector('.game-over-modal')
const score = gameplane.querySelector('.score')
const score_small = gameplane.querySelector('.score-small')
const face = pierog.querySelector('.face')

let can_be_hit = true

const meteor_img_template = new Image()
meteor_img_template.src = './images/meteor.webp'

const mushroom_img_template = new Image()
mushroom_img_template.src = './images/mushroom.webp'

class Meteor {

  constructor(){
    this.dom = null
    this.top = 0
    this.speed = game.speed
    this.create()
  }

  create(){
    this.dom = meteor_img_template.cloneNode(true)
    this.dom.className = 'meteor'

    gameplane.append(this.dom)
    // generowanie metorów w losowych miejsach od left
    this.dom.style.left = (Math.random() * (gameplane.offsetWidth - this.dom.offsetWidth)) + 'px'
    this.dom.style.transition = '.2s'
    this.top = -(this.speed + (3 * this.dom.offsetHeight))
    this.dom.style.top = this.top + 'px'
  }

  moveDown(){
    this.top += this.speed
    this.dom.style.top = this.top + 'px'
  }

  detectCollision() {
    const rect_a = this.dom.getBoundingClientRect()
    const rect_b = pierog.getBoundingClientRect()
  
    // meteor (pełne koło)
    const radius_a = rect_a.width / 2
    const center_x_a = rect_a.left + radius_a
    const center_y_a = rect_a.top + radius_a
  
    // pierog (górne półkole)
    const radius_b = rect_b.width / 2
    const center_x_b = rect_b.left + radius_b
    const center_y_b = rect_b.bottom // środek półkola – na dole
  
    const dx = center_x_a - center_x_b
    const dy = center_y_a - center_y_b
    const distance = Math.sqrt(dx * dx + dy * dy)
  
    const combined_radius = radius_a + radius_b
  
    const is_in_upper_half_circle = center_y_a <= center_y_b // tylko górna część pieroga
  
    if (distance < combined_radius && is_in_upper_half_circle) {
      return {
        x: center_x_a,
        y: center_y_a,
      }
    }
  
    return null
  }

  handleCollision(){
    if(can_be_hit){
      const collision_coords = this.detectCollision()
      if(collision_coords){

        face.classList.add('sad')
        setTimeout(() => face.classList.remove('sad'), 1000);
  
        lives.children[0].remove()

        if(! lives.children.length){
          return game.over()
        }
  
        can_be_hit = false
        pierog.classList.add('cant-hit')
  
        setTimeout(() => {
          can_be_hit = true
          pierog.classList.remove('cant-hit')
        }, 3000);
  
      }
    }
  }

}

class Meteors {

  list = [];
  iteration_to_new_meteor = 20; // jak szybko nowe meteory się tworzą - tą możesz ustawić 
  iteration_to_new_meteor_left = 0; // ta liczba zmienia się automatycznie

  addNewItem(){

    const meteor = new Meteor()
    meteor.dom.onload = () => {
      this.list.push(meteor)
    }

  }

  createNewMeteor(){

    this.iteration_to_new_meteor_left--

    if(this.iteration_to_new_meteor_left < 1){
      this.iteration_to_new_meteor_left = this.iteration_to_new_meteor * (Math.random() + 1)
      this.addNewItem()
    }

  }

  interval(){
    this.createNewMeteor()
    this.list = this.list.filter(meteor => {
      
      meteor.moveDown()
      meteor.handleCollision()
      
      if(meteor.top > gameplane.offsetHeight + meteor.dom.offsetHeight){
        meteor.dom.remove()
        return false
      }

      return true

    })

  }

  clear(){

    this.list.forEach(meteor => {
      meteor.dom.remove()
    })

    this.list = []

  }

}

const meteors = new Meteors()

class Mushroom extends Meteor{

  constructor(){
    super()
  }

  create(){
    this.dom = mushroom_img_template.cloneNode(true)
    this.dom.className = 'mushroom'

    gameplane.append(this.dom)
    // generowanie metorów w losowych miejsach od left
    this.dom.style.left = (Math.random() * (gameplane.offsetWidth - this.dom.offsetWidth)) + 'px'
    this.dom.style.transition = '.2s'
    this.top = -(this.speed + (3 * this.dom.offsetHeight))
    this.dom.style.top = this.top + 'px'
  }

  handleCollision(){

    const collision_coords = this.detectCollision()
    if(collision_coords){

      this.dom.remove()
      score.innerText = (score.innerText * 1) + 1

      face.classList.add('happy')
      setTimeout(() => face.classList.remove('happy'), 1000);

    }

  }

}

class Mushrooms extends Meteors{ 

  addNewItem(){

    const mushroom = new Mushroom()
    mushroom.dom.onload = () => {
      this.list.push(mushroom)
    }

  }
  
}

const mushrooms = new Mushrooms()

gameplane.addEventListener('mousemove', e => {
  if(game.progress){
    pierog.style.left = (e.clientX - (pierog.offsetWidth / 2) ) + 'px'
    pierog.style.top = (e.clientY - (pierog.offsetHeight / 2) ) + 'px'
  }
})

gameplane.addEventListener('touchmove', e => {
  if (game.progress && e.touches.length > 0) {
    const touch = e.touches[0]
    pierog.style.left = (touch.clientX - pierog.offsetWidth / 2) + 'px'
    pierog.style.top = (touch.clientY - pierog.offsetHeight / 2) + 'px'
  }
})

const game = {
  progress: false,
  interval: null,
  speed: 15,
  iterations: 0,
  start(){

    this.progress = true
    game_intro_modal.style.display = 'none'
    gameplane.classList.add('in-game')
    this.interval = setInterval(() => {

      this.iterations++

      if(this.iterations % 10 == 0){
        this.speed++
      }
      
      meteors.interval()
      mushrooms.interval()

    }, 100)

  },
  over(){

    clearInterval(this.interval)
    gameplane.classList.remove('in-game')
    this.progress = false

    game_over_modal.style.display = 'flex'
    score_small.innerText = score.innerText
    score.innerText = 0

  },
  restoreLives(){
    for(let i = 0; i < 3; i++){
      const live = document.createElement('div')
      live.className = 'live'
      lives.append(live)
    }
  },
}

start_button.addEventListener('click', () => {
  game.start()
})

restart_button.addEventListener('click', () => {

  meteors.clear()
  mushrooms.clear()

  game.iterations = 0
  game.speed = 15
  game.restoreLives()
  game.start()

  game_over_modal.style.display = 'none'

})