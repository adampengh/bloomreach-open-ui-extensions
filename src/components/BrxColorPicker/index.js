import { useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import UiExtension from "@bloomreach/ui-extension-saas";

import styles from './BrxColorPicker.module.css'

const PRESET_COLORS = ["#D0021B", "#F5A623", "#F8E71C", "#8B572A", "#7ED321", "#417505", "#BD10E0", "#9013FE", "#4A90E2", "#50E3C2", "#B8E986", "#000000", "#4A4A4A", "#9B9B9B", "#FFFFFF"]

const BrxColorPicker = () => {
    // Refs
    const containerRef = useRef(null);

    // State
    const [color, setColor] = useState('#fff')
    const [ui, setUi] = useState(null)
    const [brDocument, setBrDocument] = useState(null)
    const [presetColors, setPresetColors] = useState(PRESET_COLORS)

    useEffect(() => {
        initColorPicker()
    }, [])

    // Initialize the color picker
    const initColorPicker = async () => {
        // Register the UI extension
        const ui = await UiExtension.register()
        console.log('ui', ui)
        setUi(ui)

        // Get the config
        const config = ui.extension.config
        console.log('config', config)
        let configuredColors = config && JSON.parse(config).presetColors
        configuredColors = configuredColors && configuredColors.split(',')
        if (configuredColors) {
            setPresetColors(configuredColors)
            ui.document.field.setHeight(containerRef.current.offsetHeight)
        }

        const presetColorsDoc = config && JSON.parse(config).presetColorsDoc
        console.log('presetColorsDoc', presetColorsDoc)
        if (presetColorsDoc) {
            try {
                const res = await fetch(presetColorsDoc)
                const data = await res.json()

                console.log('data', data)
                const documentRef = data?.document?.$ref?.replace('/content/', '');
                console.log('documentRef', documentRef)
                const content = data?.content?.[documentRef]?.data
                console.log('content', content)
                const colors = content?.keys;
                if (colors) {
                    setPresetColors(colors)
                }
            } catch (e) {
                console.log('error', e)
            }
        }


        // Get the document
        const document = await ui.document.get()
        setBrDocument(document)

        // Get the value of the field
        const value = await ui.document.field.getValue()
        value && setColor(JSON.parse(value))

        // Adjust the height of the field to the height of the container
        ui.document.field.setHeight(containerRef.current.offsetHeight)
    }

    // Handle color change
    const handleColorChange = (color, event) => {
        console.log('color', color)
        if (brDocument?.mode === 'edit') {
            setColor(color.hex)
            ui.document.field.setValue(JSON.stringify(color))
        }
    }

    return (
        <div
            className={styles['brx-color-picker']}
            ref={containerRef}
            style={{ padding: '8px 0 16px 8px' }}
        >
            <SketchPicker
                color={color}
                onChange={handleColorChange}
                disableAlpha={true}
                presetColors={presetColors}
            />
        </div>
    )
}

export default BrxColorPicker
