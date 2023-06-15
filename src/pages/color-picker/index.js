import BrxColorPicker from '@/components/BrxColorPicker';

export const getServerSideProps = async () => {
    const res = await fetch('https://profserv02.bloomreach.io/delivery/site/v1/channels/adam-reference-spa/documents/content/documents/adam-reference-spa/administration/color-picker-preset-colors')
    const presetColorDoc = await res.json()
    return { props: { presetColorDoc } }
}

const ColorPicker = ({ presetColorDoc }) => {
    return <BrxColorPicker presetColorsDoc={presetColorDoc} />
}

export default ColorPicker;
