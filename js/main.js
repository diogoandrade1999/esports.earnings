d3.csv("https://diogoandrade1999.github.io/esports.earnings/data/EsportsData.csv", function (data) {
    if (1998 <= +data.Release && +data.Release <= 2019) {
        return {
            game: data.Game,
            genre: data.Genre,
            releaseDate: +data.Release,
            year: +data.Year,
            totalEarnings: +data.Earnings,
            players: +data.Players,
            tournaments: +data.Tournaments
        }
    }
}).then(data => {
    var groupGenre = {};
    var groupGame = {};
    var genreList = [];
    var releaseDateList = [];
    var yearList = [];
    data.forEach(d => {
        var genre = d.genre;
        var game = d.game;
        var releaseDate = d.releaseDate;
        var year = d.year;

        if (!(genre in groupGenre)) {
            groupGenre[genre] = [];
        }
        groupGenre[genre].push(d);
        
        if (!(game in groupGame)) {
            groupGame[game] = [];
        }
        groupGame[game].push(d);

        if (!genreList.includes(genre)) {
            genreList.push(genre);
        }
        if (!releaseDateList.includes(releaseDate)) {
            releaseDateList.push(releaseDate);
        }
        if (!yearList.includes(year)) {
            yearList.push(year);
        }
    });
    const minMaxReleaseDate = [Array.min(releaseDateList), Array.max(releaseDateList)];
    const minMaxYear = [Array.min(yearList), Array.max(yearList)];

    if (window.location.pathname.includes('/graphics.html')) {
        // init
        $("#min-year").html(minMaxYear[0]);
        $("#max-year").html(minMaxYear[1]);
        makeList(genreList);

        var workedData = genreDataLine(minMaxReleaseDate, minMaxYear, genreList, groupGenre);
        drawLineChart(workedData, svg1, width1, height1, margin1, "Evolution of tournament prize pools by genre", null);
        legendSvg(legendSvg1, genreList, null);

        var workedData = gameDataBar(minMaxReleaseDate, minMaxYear, genreList, groupGame, 10);
        drawBarChart(workedData, svg2, width2, height2, "Top 10 Games with the biggest Tournament Prize Pools in this period", null);

        var workedData = genreDataBar(minMaxReleaseDate, minMaxYear, genreList, groupGenre, 10);
        drawBarChart(workedData, svg3, width3, height3, "Top 10 Genres with the biggest Tournament Prize Pools in this period", null);

        /*var workedData = genreDataPie(minMaxReleaseDate, minMaxYear, genreList, groupGenre, 5);
        drawPieChart(workedData, svg4, null);*/

        // Genre Checkbox List
        $('input[name ="genre"]').on('click', function () {
            if ($(this).attr("checked")) {
                genreList = Array.remove(genreList, $(this).val());
            } else {
                genreList.push($(this).val());
            }
            $(this).attr("checked", !$(this).attr("checked"));

            // draw
            var years = [$("#min-year").text(), $("#max-year").text()];

            var workedData = genreDataLine(minMaxReleaseDate, years, genreList, groupGenre);
            drawLineChart(workedData, svg1, width1, height1, margin1, "Evolution of tournament prize pools by genre", null);
            legendSvg(legendSvg1, genreList, null);

            var workedData = gameDataBar(minMaxReleaseDate, years, genreList, groupGame, 10);
            drawBarChart(workedData, svg2, width2, height2, "Top 10 Games with the biggest Tournament Prize Pools in this period", null);

            var workedData = gameDataBar(minMaxReleaseDate, years, genreList, groupGenre, 10);
            drawBarChart(workedData, svg3, width3, height3, "Top 10 Genres with the biggest Tournament Prize Pools in this period", null);

            /*var workedData = genreDataPie(minMaxReleaseDate, years, genreList, groupGenre, 5);
            drawPieChart(workedData, svg4, null);*/
        });

        // Release Dates Slides
        $("#slider").slider({
            range: true,
            min: minMaxYear[0],
            max: minMaxYear[1],
            values: minMaxYear,
            step: 1,
            slide: function (event, ui) {
                // labels
                $("#min-year").html(ui.values[0]);
                $("#max-year").html(ui.values[1]);

                // draw
                var years = [ui.values[0], ui.values[1]];

                var workedData = genreDataLine(minMaxReleaseDate, years, genreList, groupGenre);
                drawLineChart(workedData, svg1, width1, height1, margin1, "Evolution of tournament prize pools by genre", null);
                legendSvg(legendSvg1, genreList, null);

                var workedData = gameDataBar(minMaxReleaseDate, years, genreList, groupGame, 10);
                drawBarChart(workedData, svg2, width2, height2, "Top 10 Games with the biggest Tournament Prize Pools in this period", null);

                var workedData = gameDataBar(minMaxReleaseDate, years, genreList, groupGenre, 10);
                drawBarChart(workedData, svg3, width3, height3, "Top 10 Genres with the biggest Tournament Prize Pools in this period", null);

                /*var workedData = genreDataPie(minMaxReleaseDate, years, genreList, groupGenre, 5);
                drawPieChart(workedData, svg4, null);*/
            }
        });
    } else {
        // init
        var workedData = gameDataBar([2019, 2019], [2019, 2019], genreList, groupGame, 10);
        drawBarChart(workedData, svg2, width2, height2, "Biggest prize pools for Games released in 2019", "game");

        var workedData = gameDataBar(minMaxReleaseDate, [2019, 2019], genreList, groupGame, 10);
        drawBarChart(workedData, svg3, width3, height3, "Top 10 Games with the biggest prize pools in 2019", "tournament");

        var workedData = genreDataPie(minMaxReleaseDate, [2019, 2019], genreList, groupGenre, 4);
        drawPieChart(workedData, svg4, null);

        $('#game-trailer').html('<iframe width="800" height="390" src="' + games_data["Apex Legends"].trailer +'" frameborder="0" allowfullscreen></iframe>');
        $('#game-image').html('<img src="img/' + games_data["Apex Legends"].image +'" alt="game-image" width="620">');
        $('#game-description').html('<h1><b>Apex Legends</b></h1>' + 
                                    '</br><h3>' + games_data["Apex Legends"].description + '</h3>' +
                                    '</br><h3><b>Genre:</b> Battle Royale</h3>');

        $('#tournament-trailer').html('<iframe width="800" height="390" src="' + games_data["Fortnite"].trailer +'" frameborder="0" allowfullscreen></iframe>');
        $('#tournament-image').html('<img src="img/' + games_data["Fortnite"].image +'" alt="game-image" width="620">');
        $('#tournament-description').html('<h1><b>Fortnite</b></h1>' + 
                                    '</br><h3>' + games_data["Fortnite"].description + '</h3>' +
                                    '</br><h3><b>Genre:</b> Battle Royale</h3>');
    }
});
