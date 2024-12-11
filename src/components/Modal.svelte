<script lang="ts">
    import { modal } from "./ModalFunctions";
    import Icon from "@iconify/svelte";
    import { fade, scale } from "svelte/transition";

    function closeModal() {
        const { onClose } = $modal;
        onClose();
        modal.set({ show: false, title: "", content: "", onClose: () => {} });
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            closeModal();
        }
    }

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $modal.show}
<div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    on:click={handleBackdropClick}
    role="button"
    tabindex="0"
    on:keydown={handleKeydown}
    transition:fade={{ duration: 300 }}
>
    <div 
        class="bg-[#1a1f2e] rounded-2xl w-full max-w-md shadow-xl"
        role="dialog"
        aria-modal="true"
        transition:scale={{ duration: 300 }}
    >
        <div class="p-6 space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-white">{$modal.title}</h2>
                <button 
                    class="w-10 h-10 bg-[#2a2f3e] rounded-full flex items-center justify-center"
                    on:click={closeModal}
                >
                    <Icon icon="lucide:x" class="text-3xl text-white"/>
                </button>
            </div>
            
            <div class="text-gray-300">
                {@html $modal.content}
            </div>
            
            <div class="pt-4 flex justify-center border-t border-gray-700 p-4">
                <button
                    class="px-6 py-2 bg-[#4338ca] text-white rounded-lg hover:bg-[#4338ca]/90 transition-colors"
                    on:click={closeModal}
                >
                    OK
                </button>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    div[role="dialog"] {
        animation: modal-in 0.3s ease-out;
    }

    @keyframes modal-in {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
