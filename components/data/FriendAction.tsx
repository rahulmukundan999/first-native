import { ORDER_DETAILS, SHOW_ORDER } from './Types';

export const orderDetails = data => (
    {
        type: ORDER_DETAILS,
        payload: data,
    }
);

export const showOrder = () => (
    {
        type: SHOW_ORDER
    }
)