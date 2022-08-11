export const gridRefWidth = (gridRefKey: string): any => {
    return gridRefKey.split('-')[0];
}

export const gridRefHeight = (gridRefKey: string): any => {
    return gridRefKey.split('-')[1];
}