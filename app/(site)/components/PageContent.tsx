"use client";

import SongItem from "@/components/SongItem";
import { Song } from "@/types";

interface PageContentProps {
    songs: Song[];
}


const PageContent: React.FC<PageContentProps> = ({
    songs
}) => {
    if (songs.length === 0) return (
        <div>
            <h2 className='text-white text-xl font-semibold'>Aucune musique n'a été trouvée</h2>
        </div>
    );
    return (
        <div className="
        grid
        grid-cols-2
        sm:grid-cols3
        md:grid-cols-3
        lg:grid-cold-4
        xl:grid-cols-5
        2xl:grid-cols-8
        gap-4
        mt-4">
            {songs.map((song) => (
                <SongItem
                key={song.id}
                onClick={() =>{}}
                data={song}/>
            ))}
        </div>
    );
    
};

export default PageContent;