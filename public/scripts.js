const Mask = {
  apply(input, func) {
    setTimeout(function() {
      input.value = Mask[func](input.value)
    }, 1)

  },
  formatAKZ(value) {
    value = value.replace(/\D/g,"")
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', 
      currency: 'AKZ'
    }).format(value/100)
    
  }, 
  nif(value) {
    //Mascara para o NIF
    value = value.replace(/\D/g,"")

    if (value.length > 9)
      value = value.slice(0, -1)

    value = value.replace(/(\d{3})(\d)/, "$1 $2")

    value = value.replace(/(\d{3})(\d)/, "$1 $2")

    return value

  }
}

const PhotosUpload = {
  input:"",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target
    PhotosUpload.input = event.target

    if (PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {

      PhotosUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const div = PhotosUpload.getContainer(image)

        PhotosUpload.preview.appendChild(div)
      }
      reader.readAsDataURL(file)
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    //Limitação para qunado selecionar mais de 6 fotos num único upload...
    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item =>{
      if (item.classList && item.classList.value == "photo")
      photosDiv.push(item)
    })

    //Limitação para qunado selecionar mais de 6 fotos em uploads diferentes...

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit) {
      alert('Você atingiu o limite máximo de fotos')
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemovedButton())

        return div
  }, 
  getRemovedButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML ="close"
    return button
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode //<div class="photo">
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files =PhotosUpload.getAllFiles()

    photoDiv.remove()
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove()
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  //Lista das imagens no preview na galeria
  previews: document.querySelectorAll('.gallery-preview img'),
  //Pega o clique da imagem
  setImage(e) {
    const { target } = e 

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')

    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.bottom = 0
    Lightbox.closeButton.style.top = 0
  },
  close() {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = "-100%"
    Lightbox.target.style.bottom = "initial"
    Lightbox.closeButton.style.top = "-80px"
  }
}

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input)


    let results = Validate[func](input.value)
    input.value = results.value

    if (results.error) 
      Validate.displayError(input, results.error)

    },
    displayError(input, error) {
      const div = document.createElement('div')
      div.classList.add('error')
      div.innerHTML = error
      input.parentNode.appendChild(div)
      input.focus()
    },
    clearErrors(input) {
      const errorDiv = input.parentNode.querySelector(".error")
      if (errorDiv)
        errorDiv.remove()
    },
    isEmail(value) {
      let error = null

      const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

      if (!value.match(mailFormat))
        error = "Email inválido!"

      return {
        error,
        value
      }
    },
    isNif(value) {
      let error = null 

      const cleanValues = value.replace(/\D/g, "")

      if (cleanValues.length != 9)
      error = "NIF incorreto!"
      return {
        error,
        value
      }
    }

}
