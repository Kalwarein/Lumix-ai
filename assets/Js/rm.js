class ProfessionalCanvasWorkspace {
  constructor() {
    // Canvas elements
    this.mainCanvas = document.getElementById("main-canvas")
    this.previewCanvas = document.getElementById("preview-canvas")
    this.tempCanvas = document.getElementById("temp-canvas")

    this.mainCtx = this.mainCanvas.getContext("2d")
    this.previewCtx = this.previewCanvas.getContext("2d")
    this.tempCtx = this.tempCanvas.getContext("2d")

    // Drawing state
    this.isDrawing = false
    this.isPanning = false
    this.isSelecting = false
    this.isTransforming = false

    // Current tool and settings
    this.currentTool = "brush"
    this.brushSize = 10
    this.brushHardness = 80
    this.brushOpacity = 100
    this.brushTexture = "round"
    this.currentColor = "#000000"

    // Eraser settings
    this.eraserSize = 20
    this.eraserOpacity = 100
    this.eraserHardness = 100
    this.eraserType = "normal"
    this.eraserPressure = false

    // Shape tool settings
    this.currentShape = "rectangle"
    this.shapeFillColor = "#8b5cf6"
    this.shapeStrokeColor = "#000000"
    this.shapeStrokeSize = 2

    // Flood fill settings
    this.fillColor = "#8b5cf6"
    this.fillTolerance = 32
    this.fillContiguous = true
    this.fillAntiAlias = true

    // Transform settings
    this.transformScale = 100
    this.transformRotation = 0

    // Canvas state
    this.zoomLevel = 1
    this.panX = 0
    this.panY = 0
    this.gridVisible = false
    this.snapToGrid = false

    // Selection and transform
    this.selection = null
    this.transformHandles = []

    // Text settings
    this.textSettings = {
      font: "Arial",
      size: 24,
      color: "#000000",
      bold: false,
      italic: false,
    }

    // Collaboration
    this.liveCursors = new Map()

    // History
    this.history = []
    this.historyStep = -1
    this.maxHistorySteps = 50

    // Layer system
    this.layers = [
      {
        id: 0,
        name: "Background",
        visible: true,
        locked: false,
        opacity: 100,
        blendMode: "normal",
        canvas: null,
        ctx: null,
      },
    ]
    this.activeLayerId = 0
    this.layerCounter = 1

    // Drawing path
    this.currentPath = []
    this.isPathComplete = false

    // Enhanced color picker
    this.colorPickerEnhanced = null
    this.currentColorHSL = { h: 0, s: 100, l: 50 }
    this.previousColor = "#000000"

    this.initializeEventListeners()
    this.setupCanvas()
    this.setupTools()
    this.setupFloatingToolbars()
    this.setupModals()
    this.setupKeyboardShortcuts()
    this.initializeLayers()
    this.updateToolCursor()
  }

  initializeEventListeners() {
    // Main canvas events
    this.mainCanvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
    this.mainCanvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
    this.mainCanvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
    this.mainCanvas.addEventListener("mouseout", this.handleMouseUp.bind(this))
    this.mainCanvas.addEventListener("click", this.handleClick.bind(this))
    this.mainCanvas.addEventListener("contextmenu", (e) => e.preventDefault())

    // Touch events
    this.mainCanvas.addEventListener("touchstart", this.handleTouch.bind(this))
    this.mainCanvas.addEventListener("touchmove", this.handleTouch.bind(this))
    this.mainCanvas.addEventListener("touchend", this.handleMouseUp.bind(this))

    // Prevent scrolling on touch
    document.body.addEventListener(
      "touchstart",
      (e) => {
        if (e.target === this.mainCanvas) e.preventDefault()
      },
      { passive: false },
    )

    document.body.addEventListener(
      "touchmove",
      (e) => {
        if (e.target === this.mainCanvas) e.preventDefault()
      },
      { passive: false },
    )
  }

  setupCanvas() {
    this.resizeCanvas()
    this.updateCanvasProperties()
    window.addEventListener("resize", this.resizeCanvas.bind(this))
  }

  initializeLayers() {
    this.layers.forEach((layer) => {
      layer.canvas = document.createElement("canvas")
      layer.canvas.width = this.mainCanvas.width
      layer.canvas.height = this.mainCanvas.height
      layer.ctx = layer.canvas.getContext("2d")
    })
    this.renderLayers()
  }

  setupTools() {
    const toolButtons = document.querySelectorAll(".tool-btn")
    const toolbarButtons = document.querySelectorAll(".toolbar-btn")

    toolButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tool = button.dataset.tool
        this.selectTool(tool)

        toolButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")
      })
    })

    toolbarButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action
        this.executeToolbarAction(action)
      })
    })
  }

  selectTool(tool) {
    this.currentTool = tool
    this.hideAllFloatingToolbars()
    this.updateToolCursor()
    this.updateStatusBar()

    // Show appropriate floating toolbar
    const toolbar = document.getElementById(`${tool}-toolbar`)
    if (toolbar) {
      toolbar.classList.add("active")
    }

    // Special tool setup
    switch (tool) {
      case "hand":
        this.mainCanvas.classList.add("hand-tool")
        this.mainCanvas.style.cursor = "grab"
        break
      case "eyedropper":
        this.setupEyedropper()
        this.mainCanvas.style.cursor = "crosshair"
        break
      case "text":
        this.mainCanvas.style.cursor = "text"
        break
      default:
        this.mainCanvas.classList.remove("hand-tool")
        this.mainCanvas.style.cursor = "crosshair"
    }
  }

  setupFloatingToolbars() {
    // Existing toolbars
    this.setupBrushToolbar()
    this.setupPencilToolbar()
    this.setupEraserToolbar()
    this.setupFloodFillToolbar()
    this.setupShapeToolbar()
    this.setupTransformToolbar()
    this.setupAIToolbar()

    // Close buttons
    document.querySelectorAll(".toolbar-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".floating-toolbar").classList.remove("active")
      })
    })
  }

  setupBrushToolbar() {
    const colorPreview = document.getElementById("brush-color-preview")
    const colorBtn = document.getElementById("brush-color-btn")
    const sizeSlider = document.getElementById("brush-size-slider")
    const sizeDisplay = document.getElementById("brush-size-display")
    const opacitySlider = document.getElementById("brush-opacity-slider")
    const opacityDisplay = document.getElementById("brush-opacity-display")
    const hardnessSlider = document.getElementById("brush-hardness-slider")
    const hardnessDisplay = document.getElementById("brush-hardness-display")
    const textureSelect = document.getElementById("brush-texture-select")

    if (colorPreview) colorPreview.style.background = this.currentColor

    if (colorBtn) {
      colorBtn.addEventListener("click", () => {
        this.showColorPicker((color) => {
          this.currentColor = color
          if (colorPreview) colorPreview.style.background = color
          this.updateCanvasProperties()
        })
      })
    }

    if (sizeSlider) {
      sizeSlider.addEventListener("input", (e) => {
        this.brushSize = Number.parseInt(e.target.value)
        if (sizeDisplay) sizeDisplay.textContent = this.brushSize
        this.updateCanvasProperties()
        this.updateBrushPreview()
      })
    }

    if (opacitySlider) {
      opacitySlider.addEventListener("input", (e) => {
        this.brushOpacity = Number.parseInt(e.target.value)
        if (opacityDisplay) opacityDisplay.textContent = this.brushOpacity
        this.updateCanvasProperties()
      })
    }

    if (hardnessSlider) {
      hardnessSlider.addEventListener("input", (e) => {
        this.brushHardness = Number.parseInt(e.target.value)
        if (hardnessDisplay) hardnessDisplay.textContent = this.brushHardness
        this.updateCanvasProperties()
      })
    }

    if (textureSelect) {
      textureSelect.addEventListener("change", (e) => {
        this.brushTexture = e.target.value
        this.updateCanvasProperties()
      })
    }
  }

  setupPencilToolbar() {
    const colorPreview = document.getElementById("pencil-color-preview")
    const colorBtn = document.getElementById("pencil-color-btn")
    const sizeSlider = document.getElementById("pencil-size-slider")
    const sizeDisplay = document.getElementById("pencil-size-display")
    const opacitySlider = document.getElementById("pencil-opacity-slider")
    const opacityDisplay = document.getElementById("pencil-opacity-display")

    if (colorPreview) colorPreview.style.background = this.currentColor

    if (colorBtn) {
      colorBtn.addEventListener("click", () => {
        this.showColorPicker((color) => {
          this.currentColor = color
          if (colorPreview) colorPreview.style.background = color
          this.updateCanvasProperties()
        })
      })
    }

    if (sizeSlider) {
      sizeSlider.addEventListener("input", (e) => {
        this.brushSize = Number.parseInt(e.target.value)
        if (sizeDisplay) sizeDisplay.textContent = this.brushSize
        this.updateCanvasProperties()
      })
    }

    if (opacitySlider) {
      opacitySlider.addEventListener("input", (e) => {
        this.brushOpacity = Number.parseInt(e.target.value)
        if (opacityDisplay) opacityDisplay.textContent = this.brushOpacity
        this.updateCanvasProperties()
      })
    }
  }

  setupEraserToolbar() {
    const sizeSlider = document.getElementById("eraser-size-slider")
    const sizeDisplay = document.getElementById("eraser-size-display")
    const opacitySlider = document.getElementById("eraser-opacity-slider")
    const opacityDisplay = document.getElementById("eraser-opacity-display")
    const hardnessSlider = document.getElementById("eraser-hardness-slider")
    const hardnessDisplay = document.getElementById("eraser-hardness-display")
    const typeSelect = document.getElementById("eraser-type-select")
    const pressureCheck = document.getElementById("eraser-pressure")

    if (sizeSlider) {
      sizeSlider.addEventListener("input", (e) => {
        this.eraserSize = Number.parseInt(e.target.value)
        if (sizeDisplay) sizeDisplay.textContent = this.eraserSize
        this.updateCanvasProperties()
        this.updateBrushPreview()
      })
    }

    if (opacitySlider) {
      opacitySlider.addEventListener("input", (e) => {
        this.eraserOpacity = Number.parseInt(e.target.value)
        if (opacityDisplay) opacityDisplay.textContent = this.eraserOpacity
        this.updateCanvasProperties()
      })
    }

    if (hardnessSlider) {
      hardnessSlider.addEventListener("input", (e) => {
        this.eraserHardness = Number.parseInt(e.target.value)
        if (hardnessDisplay) hardnessDisplay.textContent = this.eraserHardness
        this.updateCanvasProperties()
      })
    }

    if (typeSelect) {
      typeSelect.addEventListener("change", (e) => {
        this.eraserType = e.target.value
        this.updateCanvasProperties()
      })
    }

    if (pressureCheck) {
      pressureCheck.addEventListener("change", (e) => {
        this.eraserPressure = e.target.checked
      })
    }
  }

  setupFloodFillToolbar() {
    const colorPreview = document.getElementById("fill-color-preview")
    const colorBtn = document.getElementById("fill-color-btn")
    const toleranceSlider = document.getElementById("fill-tolerance-slider")
    const toleranceDisplay = document.getElementById("fill-tolerance-display")
    const contiguousCheck = document.getElementById("fill-contiguous")
    const antiAliasCheck = document.getElementById("fill-anti-alias")

    if (colorPreview) colorPreview.style.background = this.fillColor

    if (colorBtn) {
      colorBtn.addEventListener("click", () => {
        this.showColorPicker((color) => {
          this.fillColor = color
          if (colorPreview) colorPreview.style.background = color
        })
      })
    }

    if (toleranceSlider) {
      toleranceSlider.addEventListener("input", (e) => {
        this.fillTolerance = Number.parseInt(e.target.value)
        if (toleranceDisplay) toleranceDisplay.textContent = this.fillTolerance
      })
    }

    if (contiguousCheck) {
      contiguousCheck.addEventListener("change", (e) => {
        this.fillContiguous = e.target.checked
      })
    }

    if (antiAliasCheck) {
      antiAliasCheck.addEventListener("change", (e) => {
        this.fillAntiAlias = e.target.checked
      })
    }
  }

  setupShapeToolbar() {
    // Shape selection
    document.querySelectorAll(".shape-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".shape-btn").forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")
        this.currentShape = btn.dataset.shape
      })
    })

    // Color pickers
    const fillPreview = document.getElementById("shape-fill-preview")
    const fillBtn = document.getElementById("shape-fill-btn")
    const strokePreview = document.getElementById("shape-stroke-preview")
    const strokeBtn = document.getElementById("shape-stroke-btn")
    const strokeSlider = document.getElementById("shape-stroke-slider")
    const strokeDisplay = document.getElementById("shape-stroke-display")

    if (fillPreview) fillPreview.style.background = this.shapeFillColor
    if (strokePreview) strokePreview.style.background = this.shapeStrokeColor

    if (fillBtn) {
      fillBtn.addEventListener("click", () => {
        this.showColorPicker((color) => {
          this.shapeFillColor = color
          if (fillPreview) fillPreview.style.background = color
        })
      })
    }

    if (strokeBtn) {
      strokeBtn.addEventListener("click", () => {
        this.showColorPicker((color) => {
          this.shapeStrokeColor = color
          if (strokePreview) strokePreview.style.background = color
        })
      })
    }

    if (strokeSlider) {
      strokeSlider.addEventListener("input", (e) => {
        this.shapeStrokeSize = Number.parseInt(e.target.value)
        if (strokeDisplay) strokeDisplay.textContent = this.shapeStrokeSize
      })
    }
  }

  setupTransformToolbar() {
    document.querySelectorAll(".transform-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action
        this.executeTransformAction(action)
      })
    })

    const scaleSlider = document.getElementById("transform-scale-slider")
    const scaleDisplay = document.getElementById("transform-scale-display")

    if (scaleSlider) {
      scaleSlider.addEventListener("input", (e) => {
        this.transformScale = Number.parseInt(e.target.value)
        if (scaleDisplay) scaleDisplay.textContent = this.transformScale
        this.applyTransform()
      })
    }
  }

  setupAIToolbar() {
    const generateBtn = document.getElementById("ai-generate-btn")
    const promptInput = document.getElementById("ai-prompt")
    const styleSelect = document.getElementById("ai-style")

    if (generateBtn) {
      generateBtn.addEventListener("click", () => {
        const prompt = promptInput ? promptInput.value.trim() : ""
        const style = styleSelect ? styleSelect.value : "realistic"

        if (!prompt) {
          alert("Please enter a prompt for AI generation")
          return
        }

        this.generateAI(prompt, style)
      })
    }
  }

  setupModals() {
    this.setupTextModal()
    this.setupColorPickerModal()
    this.setupUploadModal()
  }

  setupTextModal() {
    const modal = document.getElementById("text-modal-overlay")
    const closeBtn = document.getElementById("text-modal-close")
    const cancelBtn = document.getElementById("text-cancel")
    const applyBtn = document.getElementById("text-apply")
    const fontSizeSlider = document.getElementById("font-size")
    const fontSizeDisplay = document.getElementById("font-size-display")

    if (closeBtn) closeBtn.addEventListener("click", () => this.hideTextModal())
    if (cancelBtn) cancelBtn.addEventListener("click", () => this.hideTextModal())
    if (applyBtn) applyBtn.addEventListener("click", () => this.applyText())

    if (fontSizeSlider && fontSizeDisplay) {
      fontSizeSlider.addEventListener("input", (e) => {
        fontSizeDisplay.textContent = e.target.value
      })
    }

    // Close on overlay click
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.hideTextModal()
      })
    }
  }

  setupColorPickerModal() {
    const modal = document.getElementById("color-picker-modal-overlay")
    const closeBtn = document.getElementById("color-picker-modal-close")
    const cancelBtn = document.getElementById("color-picker-cancel")
    const applyBtn = document.getElementById("color-picker-apply")

    if (closeBtn) closeBtn.addEventListener("click", () => this.hideColorPickerModal())
    if (cancelBtn) cancelBtn.addEventListener("click", () => this.hideColorPickerModal())
    if (applyBtn) applyBtn.addEventListener("click", () => this.applyColorPicker())

    // Setup color wheel
    this.setupColorWheel()

    // Close on overlay click
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.hideColorPickerModal()
      })
    }
  }

  setupUploadModal() {
    const modal = document.getElementById("upload-modal-overlay")
    const closeBtn = document.getElementById("upload-modal-close")
    const cancelBtn = document.getElementById("upload-cancel")
    const applyBtn = document.getElementById("upload-apply")
    const uploadArea = document.getElementById("upload-area")
    const fileInput = document.getElementById("file-input")

    if (closeBtn) closeBtn.addEventListener("click", () => this.hideUploadModal())
    if (cancelBtn) cancelBtn.addEventListener("click", () => this.hideUploadModal())
    if (applyBtn) applyBtn.addEventListener("click", () => this.applyUpload())

    if (uploadArea && fileInput) {
      uploadArea.addEventListener("click", () => fileInput.click())

      fileInput.addEventListener("change", (e) => {
        this.handleFileSelect(e.target.files[0])
      })

      // Drag and drop
      uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault()
        uploadArea.style.borderColor = "#8b5cf6"
      })

      uploadArea.addEventListener("dragleave", () => {
        uploadArea.style.borderColor = "#4b5563"
      })

      uploadArea.addEventListener("drop", (e) => {
        e.preventDefault()
        uploadArea.style.borderColor = "#4b5563"
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
          this.handleFileSelect(file)
        }
      })
    }

    // Close on overlay click
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.hideUploadModal()
      })
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return

      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl) {
        switch (key) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              this.redo()
            } else {
              this.undo()
            }
            break
          case "y":
            e.preventDefault()
            this.redo()
            break
          case "s":
            e.preventDefault()
            this.save()
            break
        }
      } else {
        switch (key) {
          case "b":
            this.selectToolByKey("brush")
            break
          case "e":
            this.selectToolByKey("eraser")
            break
          case "p":
            this.selectToolByKey("pencil")
            break
          case "h":
            this.selectToolByKey("hand")
            break
          case "i":
            this.selectToolByKey("eyedropper")
            break
          case "s":
            this.selectToolByKey("select")
            break
          case "t":
            this.selectToolByKey("text")
            break
          case "f":
            this.selectToolByKey("flood-fill")
            break
          case "escape":
            this.cancelCurrentAction()
            break
        }
      }
    })
  }

  // Event handlers
  handleMouseDown(e) {
    const rect = this.mainCanvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (this.mainCanvas.width / rect.width)
    const y = (e.clientY - rect.top) * (this.mainCanvas.height / rect.height)

    switch (this.currentTool) {
      case "brush":
      case "pencil":
      case "marker":
      case "airbrush":
      case "eraser":
        this.startDrawing(x, y)
        break
      case "hand":
        this.startPanning(x, y)
        break
      case "eyedropper":
        this.pickColor(x, y)
        break
      case "select":
        this.startSelection(x, y)
        break
      case "shape":
        this.startShape(x, y)
        break
    }
  }

  handleMouseMove(e) {
    const rect = this.mainCanvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (this.mainCanvas.width / rect.width)
    const y = (e.clientY - rect.top) * (this.mainCanvas.height / rect.height)

    this.updateCursorPosition(x, y)
    this.updateBrushPreview(e.clientX, e.clientY)

    if (this.isDrawing) {
      this.draw(x, y)
    } else if (this.isPanning) {
      this.pan(x, y)
    } else if (this.isSelecting) {
      this.updateSelection(x, y)
    } else if (this.currentTool === "eyedropper") {
      this.updateEyedropperPreview(x, y)
    }

    // Update live cursor for collaboration
    this.updateLiveCursor(x, y)
  }

  handleMouseUp(e) {
    if (this.isDrawing) {
      this.stopDrawing()
    } else if (this.isPanning) {
      this.stopPanning()
    } else if (this.isSelecting) {
      this.stopSelection()
    }
  }

  handleClick(e) {
    const rect = this.mainCanvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (this.mainCanvas.width / rect.width)
    const y = (e.clientY - rect.top) * (this.mainCanvas.height / rect.height)

    switch (this.currentTool) {
      case "text":
        this.showTextModal(x, y)
        break
      case "upload":
        this.showUploadModal()
        break
      case "flood-fill":
        this.floodFill(Math.floor(x), Math.floor(y))
        break
    }
  }

  handleTouch(e) {
    e.preventDefault()
    const touch = e.touches[0]
    const mouseEvent = new MouseEvent(
      e.type === "touchstart" ? "mousedown" : e.type === "touchmove" ? "mousemove" : "mouseup",
      {
        clientX: touch.clientX,
        clientY: touch.clientY,
        pressure: touch.force || 1,
      },
    )
    this.mainCanvas.dispatchEvent(mouseEvent)
  }

  // Drawing methods
  startDrawing(x, y) {
    if (!this.canDraw()) return

    this.isDrawing = true
    this.currentPath = [{ x, y, time: Date.now() }]
    this.saveState()

    const activeLayer = this.getActiveLayer()
    if (activeLayer && activeLayer.ctx) {
      activeLayer.ctx.beginPath()
      activeLayer.ctx.moveTo(x, y)
    }
  }

  draw(x, y) {
    const activeLayer = this.getActiveLayer()
    if (!activeLayer || !activeLayer.ctx) return

    // Add to path
    this.currentPath.push({ x, y, time: Date.now() })

    this.updateCanvasProperties()

    switch (this.currentTool) {
      case "brush":
      case "pencil":
      case "marker":
        activeLayer.ctx.globalCompositeOperation = "source-over"
        break
      case "eraser":
        activeLayer.ctx.globalCompositeOperation = "destination-out"
        activeLayer.ctx.lineWidth = this.eraserSize
        activeLayer.ctx.globalAlpha = this.eraserOpacity / 100

        if (this.eraserHardness < 100) {
          activeLayer.ctx.shadowBlur = (100 - this.eraserHardness) / 10
        }
        break
      case "airbrush":
        activeLayer.ctx.globalCompositeOperation = "source-over"
        activeLayer.ctx.shadowBlur = this.brushSize / 2
        activeLayer.ctx.shadowColor = this.currentColor
        break
    }

    activeLayer.ctx.lineTo(x, y)
    activeLayer.ctx.stroke()
    this.renderLayers()
  }

  stopDrawing() {
    if (!this.isDrawing) return
    this.isDrawing = false

    const activeLayer = this.getActiveLayer()
    if (activeLayer && activeLayer.ctx) {
      activeLayer.ctx.beginPath()
    }
  }

  // Panning methods
  startPanning(x, y) {
    this.isPanning = true
    this.lastPanX = x
    this.lastPanY = y
    this.mainCanvas.classList.add("dragging")
    this.mainCanvas.style.cursor = "grabbing"
  }

  pan(x, y) {
    if (!this.isPanning) return

    const deltaX = x - this.lastPanX
    const deltaY = y - this.lastPanY

    this.panX += deltaX
    this.panY += deltaY

    this.updateCanvasTransform()

    this.lastPanX = x
    this.lastPanY = y
  }

  stopPanning() {
    this.isPanning = false
    this.mainCanvas.classList.remove("dragging")
    this.mainCanvas.style.cursor = "grab"
  }

  // Color picker methods
  setupEyedropper() {
    this.createEyedropperPreview()
  }

  createEyedropperPreview() {
    let preview = document.querySelector(".eyedropper-preview")
    if (!preview) {
      preview = document.createElement("div")
      preview.className = "eyedropper-preview"
      document.body.appendChild(preview)
    }
    return preview
  }

  updateEyedropperPreview(x, y) {
    const preview = document.querySelector(".eyedropper-preview")
    if (preview && this.currentTool === "eyedropper") {
      const imageData = this.mainCtx.getImageData(x, y, 1, 1)
      const [r, g, b] = imageData.data
      const color = this.rgbToHex(r, g, b)

      preview.style.background = color
      preview.style.left = event.clientX + 20 + "px"
      preview.style.top = event.clientY - 50 + "px"
      preview.classList.add("active")
    }
  }

  pickColor(x, y) {
    const imageData = this.mainCtx.getImageData(x, y, 1, 1)
    const [r, g, b] = imageData.data
    this.currentColor = this.rgbToHex(r, g, b)

    // Update color previews in toolbars
    this.updateColorPreviews()

    // Hide eyedropper preview
    const preview = document.querySelector(".eyedropper-preview")
    if (preview) {
      preview.classList.remove("active")
    }
  }

  // Text methods
  showTextModal(x, y) {
    this.textX = x
    this.textY = y
    const modal = document.getElementById("text-modal-overlay")
    if (modal) {
      modal.classList.add("active")
      const textInput = document.getElementById("text-input")
      if (textInput) textInput.focus()
    }
  }

  hideTextModal() {
    const modal = document.getElementById("text-modal-overlay")
    if (modal) modal.classList.remove("active")
  }

  applyText() {
    const textInput = document.getElementById("text-input")
    const fontFamily = document.getElementById("font-family")
    const fontSize = document.getElementById("font-size")
    const color = document.getElementById("text-color")
    const bold = document.getElementById("text-bold")
    const italic = document.getElementById("text-italic")

    const text = textInput ? textInput.value : ""
    const fontFamilyValue = fontFamily ? fontFamily.value : "Arial"
    const fontSizeValue = fontSize ? fontSize.value : "24"
    const colorValue = color ? color.value : "#000000"
    const boldValue = bold ? bold.checked : false
    const italicValue = italic ? italic.checked : false

    if (!text.trim()) return

    const activeLayer = this.getActiveLayer()
    if (activeLayer && activeLayer.ctx) {
      let fontStyle = ""
      if (italicValue) fontStyle += "italic "
      if (boldValue) fontStyle += "bold "

      activeLayer.ctx.font = `${fontStyle}${fontSizeValue}px ${fontFamilyValue}`
      activeLayer.ctx.fillStyle = colorValue
      activeLayer.ctx.textBaseline = "top"

      const lines = text.split("\n")
      lines.forEach((line, index) => {
        activeLayer.ctx.fillText(line, this.textX, this.textY + index * fontSizeValue * 1.2)
      })

      this.renderLayers()
      this.saveState()
    }

    this.hideTextModal()
  }

  // Color picker modal methods
  showColorPicker(callback) {
    this.colorPickerCallback = callback
    const modal = document.getElementById("color-picker-modal-overlay")
    if (modal) {
      modal.classList.add("active")
      this.drawColorWheel()
    }
  }

  hideColorPickerModal() {
    const modal = document.getElementById("color-picker-modal-overlay")
    if (modal) modal.classList.remove("active")
  }

  setupColorWheel() {
    const colorWheel = document.getElementById("color-picker-wheel")

    if (colorWheel) {
      colorWheel.addEventListener("click", (e) => {
        const rect = colorWheel.getBoundingClientRect()
        const centerX = colorWheel.width / 2
        const centerY = colorWheel.height / 2
        const x = e.clientX - rect.left - centerX
        const y = e.clientY - rect.top - centerY
        const distance = Math.sqrt(x * x + y * y)
        const radius = Math.min(centerX, centerY) - 10

        if (distance <= radius) {
          const angle = (Math.atan2(y, x) * 180) / Math.PI
          const hue = (angle + 360) % 360
          const saturation = Math.min((distance / radius) * 100, 100)
          const lightness = 50

          const color = this.hslToHex(hue, saturation, lightness)
          const previewLarge = document.getElementById("color-preview-large")
          const pickerInput = document.getElementById("color-picker-input")
          const hexInputModal = document.getElementById("hex-input-modal")

          if (previewLarge) previewLarge.style.background = color
          if (pickerInput) pickerInput.value = color
          if (hexInputModal) hexInputModal.value = color
        }
      })
    }
  }

  drawColorWheel() {
    const colorWheel = document.getElementById("color-picker-wheel")
    if (!colorWheel) return

    const ctx = colorWheel.getContext("2d")
    const centerX = colorWheel.width / 2
    const centerY = colorWheel.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, colorWheel.width, colorWheel.height)

    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = ((angle - 1) * Math.PI) / 180
      const endAngle = (angle * Math.PI) / 180

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.lineWidth = 2
      ctx.strokeStyle = `hsl(${angle}, 100%, 50%)`
      ctx.stroke()
    }

    // Add saturation gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

    ctx.globalCompositeOperation = "multiply"
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, colorWheel.width, colorWheel.height)
    ctx.globalCompositeOperation = "source-over"
  }

  applyColorPicker() {
    const hexInputModal = document.getElementById("hex-input-modal")
    const color = hexInputModal ? hexInputModal.value : "#000000"
    if (this.colorPickerCallback) {
      this.colorPickerCallback(color)
    }
    this.hideColorPickerModal()
  }

  // Upload methods
  showUploadModal() {
    const modal = document.getElementById("upload-modal-overlay")
    if (modal) modal.classList.add("active")
  }

  hideUploadModal() {
    const modal = document.getElementById("upload-modal-overlay")
    if (modal) modal.classList.remove("active")

    const uploadPreview = document.getElementById("upload-preview")
    const uploadArea = document.getElementById("upload-area")
    const uploadApply = document.getElementById("upload-apply")

    if (uploadPreview) uploadPreview.style.display = "none"
    if (uploadArea) uploadArea.style.display = "block"
    if (uploadApply) uploadApply.disabled = true
  }

  handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const previewImage = document.getElementById("preview-image")
        const fileName = document.getElementById("file-name")
        const fileSize = document.getElementById("file-size")
        const uploadPreview = document.getElementById("upload-preview")
        const uploadArea = document.getElementById("upload-area")
        const uploadApply = document.getElementById("upload-apply")

        if (previewImage) previewImage.src = e.target.result
        if (fileName) fileName.textContent = file.name
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size)
        if (uploadPreview) uploadPreview.style.display = "block"
        if (uploadArea) uploadArea.style.display = "none"
        if (uploadApply) uploadApply.disabled = false

        this.uploadedImage = img
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  applyUpload() {
    if (this.uploadedImage) {
      const activeLayer = this.getActiveLayer()
      if (activeLayer && activeLayer.ctx) {
        // Scale image to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          this.mainCanvas.width / this.uploadedImage.width,
          this.mainCanvas.height / this.uploadedImage.height,
        )
        const width = this.uploadedImage.width * scale
        const height = this.uploadedImage.height * scale
        const x = (this.mainCanvas.width - width) / 2
        const y = (this.mainCanvas.height - height) / 2

        activeLayer.ctx.drawImage(this.uploadedImage, x, y, width, height)
        this.renderLayers()
        this.saveState()
      }
    }
    this.hideUploadModal()
  }

  // Transform methods
  executeTransformAction(action) {
    const activeLayer = this.getActiveLayer()
    if (!activeLayer || !activeLayer.ctx) return

    const canvas = activeLayer.canvas
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext("2d")

    switch (action) {
      case "rotate-left":
        tempCtx.translate(canvas.width / 2, canvas.height / 2)
        tempCtx.rotate(-Math.PI / 2)
        tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)
        break
      case "rotate-right":
        tempCtx.translate(canvas.width / 2, canvas.height / 2)
        tempCtx.rotate(Math.PI / 2)
        tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)
        break
      case "flip-horizontal":
        tempCtx.scale(-1, 1)
        tempCtx.drawImage(canvas, -canvas.width, 0)
        break
      case "flip-vertical":
        tempCtx.scale(1, -1)
        tempCtx.drawImage(canvas, 0, -canvas.height)
        break
    }

    activeLayer.ctx.clearRect(0, 0, canvas.width, canvas.height)
    activeLayer.ctx.drawImage(tempCanvas, 0, 0)
    this.renderLayers()
    this.saveState()
  }

  applyTransform() {
    // Apply scale transformation
    if (this.transformScale !== 100) {
      const activeLayer = this.getActiveLayer()
      if (activeLayer && activeLayer.ctx) {
        const scale = this.transformScale / 100
        const canvas = activeLayer.canvas
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext("2d")

        tempCtx.scale(scale, scale)
        tempCtx.drawImage(canvas, 0, 0)

        activeLayer.ctx.clearRect(0, 0, canvas.width, canvas.height)
        activeLayer.ctx.drawImage(tempCanvas, 0, 0)
        this.renderLayers()
      }
    }
  }

  // AI Generation
  generateAI(prompt, style) {
    const generateBtn = document.getElementById("ai-generate-btn")
    if (generateBtn) {
      generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...'
      generateBtn.disabled = true
    }

    // Simulate AI generation
    setTimeout(() => {
      const activeLayer = this.getActiveLayer()
      if (activeLayer && activeLayer.ctx) {
        // Create a gradient as placeholder for AI generated content
        const gradient = activeLayer.ctx.createLinearGradient(0, 0, 400, 300)
        gradient.addColorStop(0, "#8b5cf6")
        gradient.addColorStop(0.5, "#ec4899")
        gradient.addColorStop(1, "#06b6d4")

        activeLayer.ctx.fillStyle = gradient
        activeLayer.ctx.fillRect(50, 50, 400, 300)

        // Add text overlay
        activeLayer.ctx.fillStyle = "#ffffff"
        activeLayer.ctx.font = "bold 24px Arial"
        activeLayer.ctx.textAlign = "center"
        activeLayer.ctx.fillText("AI Generated", 250, 150)
        activeLayer.ctx.fillText(`Style: ${style}`, 250, 180)

        // Add prompt text (truncated)
        activeLayer.ctx.font = "16px Arial"
        const truncatedPrompt = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt
        activeLayer.ctx.fillText(truncatedPrompt, 250, 210)

        this.renderLayers()
        this.saveState()
      }

      if (generateBtn) {
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate'
        generateBtn.disabled = false
      }
    }, 3000)
  }

  // Selection methods
  startSelection(x, y) {
    this.isSelecting = true
    this.selectionStartX = x
    this.selectionStartY = y
  }

  updateSelection(x, y) {
    if (!this.isSelecting) return

    // Clear preview canvas
    this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height)

    // Draw selection rectangle
    this.previewCtx.strokeStyle = "#8b5cf6"
    this.previewCtx.lineWidth = 2
    this.previewCtx.setLineDash([5, 5])
    this.previewCtx.strokeRect(
      this.selectionStartX,
      this.selectionStartY,
      x - this.selectionStartX,
      y - this.selectionStartY,
    )
  }

  stopSelection() {
    if (!this.isSelecting) return
    this.isSelecting = false

    // Create selection object
    this.selection = {
      x: Math.min(this.selectionStartX, this.currentX),
      y: Math.min(this.selectionStartY, this.currentY),
      width: Math.abs(this.currentX - this.selectionStartX),
      height: Math.abs(this.currentY - this.selectionStartY),
    }
  }

  // Utility methods
  updateCanvasProperties() {
    const activeLayer = this.getActiveLayer()
    if (!activeLayer || !activeLayer.ctx) return

    activeLayer.ctx.lineCap = "round"
    activeLayer.ctx.lineJoin = "round"
    activeLayer.ctx.lineWidth = this.brushSize
    activeLayer.ctx.strokeStyle = this.currentColor
    activeLayer.ctx.globalAlpha = this.brushOpacity / 100

    // Apply brush hardness
    if (this.brushHardness < 100) {
      activeLayer.ctx.shadowBlur = (100 - this.brushHardness) / 10
      activeLayer.ctx.shadowColor = this.currentColor
    } else {
      activeLayer.ctx.shadowBlur = 0
    }
  }

  updateToolCursor() {
    this.mainCanvas.className = `canvas-layer tool-${this.currentTool}`
  }

  updateStatusBar() {
    const currentToolElement = document.getElementById("current-tool")
    if (currentToolElement) {
      currentToolElement.textContent = this.currentTool.charAt(0).toUpperCase() + this.currentTool.slice(1)
    }
  }

  updateCursorPosition(x, y) {
    const cursorPosition = document.getElementById("cursor-position")
    if (cursorPosition) {
      cursorPosition.textContent = `${Math.round(x)}, ${Math.round(y)}`
    }
  }

  updateBrushPreview(clientX, clientY) {
    if (this.currentTool === "brush" || this.currentTool === "pencil" || this.currentTool === "eraser") {
      let preview = document.querySelector(".brush-preview")
      if (!preview) {
        preview = document.createElement("div")
        preview.className = "brush-preview"
        document.body.appendChild(preview)
      }

      const size = this.currentTool === "eraser" ? this.eraserSize : this.brushSize
      preview.style.width = size * this.zoomLevel + "px"
      preview.style.height = size * this.zoomLevel + "px"
      preview.style.left = clientX + "px"
      preview.style.top = clientY + "px"
      preview.classList.add("active")
    } else {
      const preview = document.querySelector(".brush-preview")
      if (preview) {
        preview.classList.remove("active")
      }
    }
  }

  updateColorPreviews() {
    const previews = document.querySelectorAll(".color-preview")
    previews.forEach((preview) => {
      if (preview.id.includes("brush") || preview.id.includes("pencil")) {
        preview.style.background = this.currentColor
      }
    })
  }

  updateLiveCursor(x, y) {
    // Simulate live cursor for collaboration
    const cursorsContainer = document.getElementById("live-cursors")
    if (!cursorsContainer) return

    let cursor = cursorsContainer.querySelector('[data-user="You"]')

    if (!cursor) {
      cursor = document.createElement("div")
      cursor.className = "live-cursor"
      cursor.dataset.user = "You"
      cursor.style.background = "#8b5cf6"
      cursorsContainer.appendChild(cursor)
    }

    const rect = this.mainCanvas.getBoundingClientRect()
    cursor.style.left = (x * rect.width) / this.mainCanvas.width + "px"
    cursor.style.top = (y * rect.height) / this.mainCanvas.height + "px"
  }

  hideAllFloatingToolbars() {
    document.querySelectorAll(".floating-toolbar").forEach((toolbar) => {
      toolbar.classList.remove("active")
    })
  }

  selectToolByKey(tool) {
    const toolBtn = document.querySelector(`[data-tool="${tool}"]`)
    if (toolBtn) {
      toolBtn.click()
    }
  }

  cancelCurrentAction() {
    this.isDrawing = false
    this.isPanning = false
    this.isSelecting = false
    this.hideAllFloatingToolbars()
    this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height)
    this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height)
  }

  // Layer methods
  getActiveLayer() {
    return this.layers.find((layer) => layer.id === this.activeLayerId)
  }

  renderLayers() {
    this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)

    this.layers.forEach((layer) => {
      if (!layer.visible) return

      this.mainCtx.save()
      this.mainCtx.globalAlpha = layer.opacity / 100
      this.mainCtx.globalCompositeOperation = layer.blendMode
      this.mainCtx.drawImage(layer.canvas, 0, 0)
      this.mainCtx.restore()
    })
  }

  canDraw() {
    const activeLayer = this.getActiveLayer()
    return (
      activeLayer &&
      !activeLayer.locked &&
      (this.currentTool === "brush" ||
        this.currentTool === "pencil" ||
        this.currentTool === "marker" ||
        this.currentTool === "airbrush" ||
        this.currentTool === "eraser")
    )
  }

  // Canvas management
  resizeCanvas() {
    const container = this.mainCanvas.parentElement
    const rect = container.getBoundingClientRect()

    const maxWidth = rect.width - 40
    const maxHeight = rect.height - 40
    const minWidth = 200
    const minHeight = 150

    const aspectRatio = this.mainCanvas.width / this.mainCanvas.height
    let newWidth = Math.max(Math.min(maxWidth, 1024), minWidth)
    const newHeight = Math.max(Math.min(newWidth / aspectRatio, maxHeight), minHeight)

    if (newHeight === minHeight || newHeight === maxHeight) {
      newWidth = newHeight * aspectRatio
    }

    // Apply to all canvas layers
    const canvases = [this.mainCanvas, this.previewCanvas, this.tempCanvas]
    canvases.forEach((canvas) => {
      canvas.style.width = newWidth + "px"
      canvas.style.height = newHeight + "px"
    })
  }

  updateCanvasTransform() {
    const transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`
    const canvases = [this.mainCanvas, this.previewCanvas, this.tempCanvas]
    canvases.forEach((canvas) => {
      canvas.style.transform = transform
    })
  }

  // Toolbar actions
  executeToolbarAction(action) {
    switch (action) {
      case "undo":
        this.undo()
        break
      case "redo":
        this.redo()
        break
      case "zoom-in":
        this.zoomIn()
        break
      case "zoom-out":
        this.zoomOut()
        break
      case "fit":
        this.fitToScreen()
        break
      case "fullscreen":
        this.toggleFullscreen()
        break
      case "grid":
        this.toggleGrid()
        break
      case "clear":
        this.clearCanvas()
        break
    }
  }

  undo() {
    if (this.historyStep > 0) {
      this.historyStep--
      this.restoreState(this.history[this.historyStep])
    }
  }

  redo() {
    if (this.historyStep < this.history.length - 1) {
      this.historyStep++
      this.restoreState(this.history[this.historyStep])
    }
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel * 1.2, 5)
    this.updateZoom()
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.1)
    this.updateZoom()
  }

  fitToScreen() {
    this.zoomLevel = 1
    this.panX = 0
    this.panY = 0
    this.updateZoom()
  }

  updateZoom() {
    this.updateCanvasTransform()
    const zoomLevelElement = document.querySelector(".zoom-level")
    if (zoomLevelElement) {
      zoomLevelElement.textContent = Math.round(this.zoomLevel * 100) + "%"
    }
  }

  toggleGrid() {
    this.gridVisible = !this.gridVisible
    const grid = document.getElementById("canvas-grid")
    if (grid) {
      grid.classList.toggle("visible", this.gridVisible)
    }

    const gridBtn = document.querySelector('[data-action="grid"]')
    if (gridBtn) {
      gridBtn.classList.toggle("active", this.gridVisible)
    }
  }

  toggleFullscreen() {
    const isFullscreen = document.fullscreenElement
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  clearCanvas() {
    if (confirm("Are you sure you want to clear the canvas?")) {
      const activeLayer = this.getActiveLayer()
      if (activeLayer && activeLayer.ctx) {
        activeLayer.ctx.clearRect(0, 0, activeLayer.canvas.width, activeLayer.canvas.height)
        this.renderLayers()
        this.saveState()
      }
    }
  }

  // History system
  saveState() {
    const state = {
      layers: this.layers.map((layer) => ({
        ...layer,
        imageData: layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height),
      })),
      activeLayerId: this.activeLayerId,
    }

    this.historyStep++
    this.history = this.history.slice(0, this.historyStep)
    this.history.push(state)

    if (this.history.length > this.maxHistorySteps) {
      this.history.shift()
      this.historyStep--
    }
  }

  restoreState(state) {
    this.layers = state.layers.map((layerState) => {
      const layer = { ...layerState }
      layer.canvas = document.createElement("canvas")
      layer.canvas.width = this.mainCanvas.width
      layer.canvas.height = this.mainCanvas.height
      layer.ctx = layer.canvas.getContext("2d")
      layer.ctx.putImageData(layerState.imageData, 0, 0)
      return layer
    })

    this.activeLayerId = state.activeLayerId
    this.renderLayers()
  }

  // Flood fill
  floodFill(startX, startY) {
    const activeLayer = this.getActiveLayer()
    if (!activeLayer || !activeLayer.ctx) return

    const imageData = activeLayer.ctx.getImageData(0, 0, activeLayer.canvas.width, activeLayer.canvas.height)
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height

    const startPos = (startY * width + startX) * 4
    const startR = data[startPos]
    const startG = data[startPos + 1]
    const startB = data[startPos + 2]
    const startA = data[startPos + 3]

    const fillRGB = this.hexToRgb(this.fillColor)
    if (!fillRGB) return

    // Check if we're trying to fill with the same color
    if (startR === fillRGB.r && startG === fillRGB.g && startB === fillRGB.b) return

    const stack = [[startX, startY]]
    const visited = new Set()

    while (stack.length > 0) {
      const [x, y] = stack.pop()
      const key = `${x},${y}`

      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) continue
      visited.add(key)

      const pos = (y * width + x) * 4
      const r = data[pos]
      const g = data[pos + 1]
      const b = data[pos + 2]
      const a = data[pos + 3]

      // Check if pixel matches start color within tolerance
      const colorDiff = Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB)
      if (colorDiff > this.fillTolerance) continue

      // Fill pixel
      data[pos] = fillRGB.r
      data[pos + 1] = fillRGB.g
      data[pos + 2] = fillRGB.b
      data[pos + 3] = 255

      // Add neighboring pixels to stack
      if (this.fillContiguous) {
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
      }
    }

    activeLayer.ctx.putImageData(imageData, 0, 0)
    this.renderLayers()
    this.saveState()
  }

  // Color utilities
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  hslToHex(h, s, l) {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return this.rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Save and export
  save() {
    const dataURL = this.mainCanvas.toDataURL()
    localStorage.setItem("canvas-data", dataURL)
    console.log("Canvas saved")
  }

  export() {
    const link = document.createElement("a")
    link.download = "canvas-export.jpg"
    link.href = this.mainCanvas.toDataURL()
    link.click()
  }
}

// Initialize the workspace when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const workspace = new ProfessionalCanvasWorkspace()

  // Add save and export functionality
  const saveBtn = document.querySelector(".save-btn")
  const exportBtn = document.querySelector(".export-btn")

  if (saveBtn) saveBtn.addEventListener("click", () => workspace.save())
  if (exportBtn) exportBtn.addEventListener("click", () => workspace.export())

  // Mobile sidebar toggle
  if (window.innerWidth <= 768) {
    const rightSidebar = document.querySelector(".right-sidebar")
    const overlay = document.createElement("div")
    overlay.className = "sidebar-overlay"
    document.body.appendChild(overlay)

    // Toggle sidebar on mobile
    document.addEventListener("click", (e) => {
      if (e.target.closest(".tool-btn[data-tool='layers']")) {
        e.stopPropagation()
        if (rightSidebar) rightSidebar.classList.toggle("open")
        overlay.classList.toggle("active")
      }
    })

    overlay.addEventListener("click", () => {
      if (rightSidebar) rightSidebar.classList.remove("open")
      overlay.classList.remove("active")
    })
  }
})

// Handle window resize
window.addEventListener("resize", () => {
  const rightSidebar = document.querySelector(".right-sidebar")
  const overlay = document.querySelector(".sidebar-overlay")

  if (window.innerWidth > 768) {
    if (rightSidebar) rightSidebar.classList.remove("open")
    if (overlay) {
      overlay.classList.remove("active")
    }
  }
})
