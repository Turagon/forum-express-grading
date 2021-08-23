const restaurantsList = document.querySelector('.restaurants-list')
// const container = document.querySelector('.container')
// const head = document.querySelector('.todo-head')
const myModal = new bootstrap.Modal(document.querySelector('.modalBox'))
const form = document.querySelector('#delete-submit')

if (restaurantsList) {
  restaurantsList.addEventListener('click', event => {
  console.log("🚀 ~ file: deleteModal.js ~ line 9 ~ event", event)
    if (event.target.id = 'delete-btn') {
      const id = event.target.dataset.id
      form.action = `/admin/restaurants/${id}?_method=DELETE`
      myModal.show()
      form.addEventListener('click', event => {
        if (event.target.classList.contains('delete-confirm')) {
          myModal.hide()
          myModal.dispose()
        }
      })
    }
  })
}