console.log("Server kaze: Trenutni broj slika: " + Images.find().count());

    if (Images.find().count() == 2) {
        for (var i = 3; i < 6; i++) {
            Images.insert({
                img_src: "earth.jpg",
                img_alt: "Nema slike jarane2"
            });
        }
    }
