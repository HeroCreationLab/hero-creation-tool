function getCharacter() {
    if (!window.heroMancer){
        window.heroMancer = {};
        let character = window.heroMancer;
        character.resistances = [];
    }
    return window.heroMancer
}

