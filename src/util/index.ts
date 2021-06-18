import axios from 'axios';
import { useLocation } from 'react-router-dom';

export const axs = axios.create({
    baseURL: 'http://localhost:9000/'
});

export function useURLQuery() {
    return new URLSearchParams(useLocation().search);
}
