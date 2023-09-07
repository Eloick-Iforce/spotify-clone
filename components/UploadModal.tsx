"use client";

import useUploadModal from "@/hooks/useUploadModal";

import Modal from "./Modal";

const UploadModal = () => {

    const UploadModal = useUploadModal();

    const onChange = (open: boolean) => {
        if (!open) {
            UploadModal.onClose();
        }
    }
        

    return (
        <Modal title="Ajout de musique"
        description="Ajouter une musique au format mp3"
        isOpen={UploadModal.isOpen}
        onChange={onChange}>
            //form

        </Modal>
    );
}

export default UploadModal;