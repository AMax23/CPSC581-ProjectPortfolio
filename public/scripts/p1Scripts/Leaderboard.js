class Leaderboard {

    constructor() {
        this.myHeaders = new Headers();
        this.myHeaders.append("Content-Type", "application/json");
    }

    postScore(name, score, accuracy) {
        let queryParam = {
            "playername": name,
            "score": score,
            "accuracy": accuracy
        };

        let raw = JSON.stringify(queryParam);

        let requestOptions = {
            method: 'POST',
            headers: this.myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/score", requestOptions)
            .then(response => response.text())
            //.then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    getScores() {
        let requestOptions = {
            method: 'GET',
            headers: this.myHeaders,
            redirect: 'follow'
        };

        fetch("/leaderboard", requestOptions)
            .then(response => response.json())
            .then(result => this.appendResults(result))
            .catch(error => console.log('error', error));
    }

    appendResults(result) {
        //console.log(result.rows);
        // Go through the HTML table and append these new values thats returned from the query.
        for (let i = 1; i <= result.rows.length; i++) {
            document.getElementById(i + "Name").innerText = result.rows[i - 1].playername;
            document.getElementById(i + "Score").innerText = result.rows[i - 1].score;
            document.getElementById(i + "Acc").innerText = result.rows[i - 1].accuracy * 100 + "%";
        }
    }
}


// Testing
//let a = new Leaderboard();
//a.postScore('Ahmed', 200, 1);
//a.getScores();