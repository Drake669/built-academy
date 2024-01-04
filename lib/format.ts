const formatNumber = (price: number) => {
    return  Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(
        price)
}

export default formatNumber