import { writable } from "svelte/store";

export const modal = writable({
    show: false,
    title: "",
    content: "",
    onClose: () => {}
});

export function openModal(title: string, content: string, onClose = () => {}) {
    modal.set({ show: true, title, content, onClose });
}

export function closeModal() {
    modal.set({ show: false, title: "", content: "", onClose: () => {} });
}
