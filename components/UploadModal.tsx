"use client";

import useUploadModal from "@/hooks/useUploadModal";

import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
  const UploadModal = useUploadModal();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      UploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try{
        setIsLoading(true);
        const imageFile = values.image?.[0];
        const songFile = values.song?.[0];

        if (!imageFile || !songFile || !user) { 
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        const uniqueID = uniqid();

        const { data: songData, error: SongError } = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}.mp3`, songFile, {
            cacheControl: '3600',
            upsert: false,
            });

        if (SongError) {
            setIsLoading(false);
            return toast.error("Impossible d'uploader la musique");
        }

        const { data: imageData, error: ImageError } = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}.png`, imageFile, {
            cacheControl: '3600',
            upsert: false,
            });
        
        if (ImageError) {
            setIsLoading(false);
            return toast.error("Impossible d'uploader la couverture");
        }


        const {
            error: supabaseError,
        } = await supabaseClient.from('songs').insert({
            user_id: user.id,
            title: values.title,
            author: values.author,
            image_path: imageData.path,
            song_path: songData.path,
        }
        );

        if (supabaseError) {
            setIsLoading(false);
            return toast.error(supabaseError.message);
        }

        router.refresh();
        setIsLoading(false);
        toast.success("Musique ajoutée avec succès");
        reset();
        UploadModal.onClose();
    }
    catch (error) {
        toast.error("Quelque chose s'est mal passé");
    }
    finally {
        setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Ajout de musique"
      description="Ajouter une musique au format mp3"
      isOpen={UploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Nom de la musique"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Auteur de la musique"
        />
        <div>
            <div className="pb-1">
                Choisisez le fichier audio
            </div>
            <Input
                id="song"
                type="file"
                disabled={isLoading}
                accept=".mp3"
                {...register('song', {required: true})}/>
        </div>
        <div>
            <div className="pb-1">
                Choisisez la couverture
            </div>
            <Input
                id="image"
                type="file"
                disabled={isLoading}
                accept="image/*"
                {...register('image', {required: true})}/>
        </div>
        <Button disabled={isLoading} type="submit">
            Créer
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
