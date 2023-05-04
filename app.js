const express = require('express')
const app = express()
const port = 3000
let bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}))


app.post('/getData', async (req, res) => {
    let ticket_ID = req.body.Ticket_ID;
    let assignee_ID = req.body.Assignee_ID;
    console.log("TicketID", ticket_ID)
    if (ticket_ID != null && assignee_ID != null) {
        await fetch(`https://pdi-xoogle.zendesk.com/api/v2/agent_availabilities/${assignee_ID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from('harshit@xoogle.in:Harshit#245')
            },
        }).then(response => response.text())
            .then((data) => {
                data = JSON.parse(data);
                let isAgent = data.data.attributes.agent_status.name;

                if (isAgent == "offline") {
                    fetch(`https://pdi-xoogle.zendesk.com/api/v2/tickets/${ticket_ID}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + Buffer.from('harshit@xoogle.in:Harshit#245')
                        },
                        body: JSON.stringify({
                            "ticket":
                            {
                                "subject": "API Auth Testing2",
                                "assignee_id": null,
                            }
                        })
                    }
                    ).then(response => response.text())
                        .then((data) => {
                            console.log("Ticket Updated Successfully")
                        });
                }
            });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
