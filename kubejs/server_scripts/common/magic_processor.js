/**
 * @param {Internal.CustomSpell$CastContext} ctx 
 * @returns 
 */
global.toTheLostWorld = (ctx) => {
    /** @type {Internal.ServerPlayer} */
    let player = ctx.entity

    if (player.stages.has('flos_magic_stage_3')) {
        player.stages.remove('flos_magic_stage_3')
        player.stages.add('flos_magic_stage_4')
        player.stages.add('curse_mining_fatigue')
        player.stages.add('curse_of_fragility')
        player.stages.add('curse_monster_ability_bonus')
    }

    if (!player.stages.has('flos_magic_stage_4')) return

    if (ctx.level.getDimension() == 'kubejs:lost_memory') {
        Utils.server.scheduleInTicks(20 * 1, (callback) => {
            player.teleportTo('minecraft:overworld', 0, 250, 0, 0, 0)
            player.potionEffects.add('minecraft:slow_falling', 60 * 20, 0)
        })
        return
    }

    Utils.server.scheduleInTicks(20 * 1, (callback) => {
        player.teleportTo('kubejs:lost_memory', 0, 250, 0, 0, 0)
        player.potionEffects.add('minecraft:slow_falling', 60 * 20, 0)
    })
}


/**
 * @param {Internal.CustomSpell$CastContext} ctx 
 * @returns 
 */
global.endlessDream = (ctx) => {
    /** @type {Internal.ServerPlayer} */
    let player = ctx.entity
    if (!player.hasEffect('kubejs:sweet_dream')) return
    let spellLevel = ctx.getSpellLevel()
    let dreamEffect = player.getEffect('kubejs:sweet_dream')
    player.potionEffects.add('kubejs:sweet_dream', 5 + spellLevel * 20 * 5 + dreamEffect.getDuration(), Math.ceil(spellLevel / 5) + dreamEffect.getAmplifier())
    for (let i = 0; i < 16; i++) {
        let theta = 2 * JavaMath.PI / 16 * i
        let dx = Math.cos(theta) * 1.25;
        let dz = Math.sin(theta) * 1.25;
        player.level.spawnParticles($ParticleTypes.HEART, false, player.x + dx, player.y + 1, player.z + dz, 0, 1, 0, 1, 0.5)
    }
}


/**
 * @param {Internal.CustomSpell$CastContext} ctx 
 * @returns 
 */
global.dreamOfNeedles = (ctx) => {
    /** @type {Internal.ServerPlayer} */
    let player = ctx.entity
    if (!player.hasEffect('kubejs:sweet_dream')) return
    let ray = player.rayTrace(32, true)
    if (!ray.hit) return

    let dreamEffect = player.getEffect('kubejs:sweet_dream')
    player.removeEffect('kubejs:sweet_dream')
    player.potionEffects.add('kubejs:sweet_dream', dreamEffect.getDuration(), Math.max(dreamEffect.getAmplifier() - 1, 0))

    let spellLevel = ctx.getSpellLevel()
    let powerModifier = player.getAttributeValue(global.attributes.CANDY_SPELL_POWER.get())
    let damage = 5 + dreamEffect.getDuration() / 100
    damage = damage * (1 + powerModifier)

    // 限制数量上限，避免性能问题
    let count = Math.min(120, 3 + dreamEffect.getAmplifier())
    let degreesPerNeedle = 360 / count

    // 根据法术等级，产生新的释放环，限制上下限
    let castTimes = Math.min(Math.max(Math.ceil(spellLevel / 5), 1), 5)
    for (let j = 1; j < castTimes + 1; j++) {
        for (let i = 0; i < count; i++) {
            let needle = new $BloodNeedle(player.level, player)
            let rotation = degreesPerNeedle * i - (degreesPerNeedle / 2)
            needle.setDamage(damage)
            needle.setZRot(rotation)

            let spawn = player.getEyePosition().add(new Vec3(0, j, 0).zRot(rotation * JavaMath.PI / 180).xRot(-player.xRot * JavaMath.PI / 180).yRot(-player.yRot * JavaMath.PI / 180))
            needle.moveTo(spawn)
            needle.shoot(ray.hit.subtract(spawn).normalize())
            player.level.addFreshEntity(needle)
        }
    }
}