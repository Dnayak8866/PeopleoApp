export const getPositionNameById = (id: number, designations: any[]) => {
    return designations?.find((designation) => designation.designation_id === id)?.name;
}

export const formatToOptions = (data: any[], idKey: string, valueKey: string) => {
    return data?.map((item) => ({
        id: item[idKey],
        value: item[valueKey],
    })) || [];
};