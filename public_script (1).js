document.addEventListener('DOMContentLoaded', () => {
    const musicGallery = document.getElementById('musicGallery');

    // Load static music data
    const musicData = [
        { title: "Sample Track 1", artist: "Artist A", genre: "Pop", type: "Single", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Sample Track 2", artist: "Artist B", genre: "Rock", type: "Album", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
    ];

    // Display music
    musicData.forEach((track) => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow-md';
        card.innerHTML = `
            <h3 class="text-xl font-semibold text-indigo-600">${track.title}</h3>
            <p class="text-gray-600">Artist: ${track.artist}</p>
            <p class="text-gray-600">Genre: ${track.genre.charAt(0).toUpperCase() + track.genre.slice(1)}</p>
            <p class="text-gray-600">Type: ${track.type.charAt(0).toUpperCase() + track.type.slice(1)}</p>
            <audio controls class="w-full mt-4">
                <source src="${track.audioUrl}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        musicGallery.appendChild(card);
    });
});