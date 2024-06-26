StartupEvents.registry('sound_event', event => {
    event.create("kubejs:slow_down_song")
    event.create("kubejs:beak_metal")
    event.create("kubejs:beak_mangrove_roots")
})
  


StartupEvents.registry('item', event => {
    event.create("kubejs:slow_down_disc", "music_disc")
        .song("kubejs:slow_down_song", 99)
        .analogOutput(1)
        .texture("kubejs:item/slow_down_disc")
        .displayName("Music Disc: Slow Down")
        .maxStackSize(64)
})