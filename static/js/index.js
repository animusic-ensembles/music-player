import { playlist } from "./playlist.js";

$(document).ready(function() {
    const $player = $("#player");
    const $slider = $("#seek-slider");
    const $time = $(".current-time");
    const $duration = $(".duration");
    const shuffledPlaylist = shuffle(playlist);
    console.log(shuffledPlaylist);
    let currentTrack = 0;

    setMusic();

    $player.on("loadeddata", function() {
        $slider[0].max = $player[0].duration;
        $duration.text(calculateTime($player[0].duration));
    });

    $player.on("timeupdate", function() {
        $slider[0].value = Math.floor($player[0].currentTime);
        $time.text(calculateTime($player[0].currentTime));
        $(".timeline")[0].style.setProperty("--seek-before-width", `${($player[0].currentTime / $player[0].duration) * 100}%`);
    });

    $player.on("ended", function() {
        $player[0].pause();
        setMusic();
        console.log(shuffledPlaylist[currentTrack]);
    });

    function setMusic() {
        $(".title-text").text(shuffledPlaylist[currentTrack].replace("_", "."));
        setScrollingText();
        $player[0].src = getPath(shuffledPlaylist[currentTrack]);
        $player[0].load();
        $player[0].play();
        currentTrack = (currentTrack + 1) % shuffledPlaylist.length;
    }

    function calculateTime(sec) {
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
    }

    function setScrollingText() {
        $(".song-info")[0].style.setProperty("--duplicate-title", "");
        $(".song-title").removeClass("scrolling-wrapper");
        $(".title-text").removeClass("scrolling");

        if($(".song-title")[0].scrollWidth > $(".song-title").innerWidth()) {
            $(".song-info")[0].style.setProperty("--duplicate-title", JSON.stringify(shuffledPlaylist[currentTrack].replace("_", ".")));
            $(".song-title").addClass("scrolling-wrapper");
            $(".title-text").addClass("scrolling");
        }
    }

    function shuffle(array) {
        return array.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    }

    function getPath(title) {
        return `./static/music/${title}.mp3`;
    }
});