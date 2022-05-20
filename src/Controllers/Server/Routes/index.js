// Models
const { BrowserWindow } = require("electron");
const TextReceiptRender = require("../../Printers/TextReceiptRender");

const path = require('path');

const fs = require("fs");

const Server = (app) => {

    app.get("/get-printers", async (req, res) => {
        const printers = await req.window.webContents.getPrintersAsync();
        console.log(printers)
        res.status(200).send(printers)
    })

    app.get("/app-zap-running", (req, res) => {
        res.status(200).send({status:true}).send();
    });

    app.post("/print", async (req, res) => {

        const bodyContent = req.body;

        if (bodyContent) {

            const printWindow = new BrowserWindow({
                width: 500,
                height: 500,
                center: true,
                show: false,
            })

            let pathToOrder = `src/tmp/print-order-${bodyContent.order.id}.`;

            const orderPlainText = TextReceiptRender(bodyContentorder, bodyContent.type);

            if (bodyContent.format == "text") {
                pathToOrder += "txt"
                fs.writeFileSync(pathToOrder, orderPlainText, "utf8");
            } else {
                pathToOrder += "html"
                fs.writeFileSync(pathToOrder, `
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Print</title>
                    <style>
                        *{
                            margin: 0;
                            padding: 0;
                            border: 0;
                            
                        }
                        body{
                            font-family: "Consolas", "Courier New", monospace;
                            font-weight: 500;
                        }
                    </style>
                </head>
                <body>
                    ${orderPlainText.replaceAll("\n", "<br>")}
                </body>
                </html>
                
                `, "utf8");
            }

            printWindow.loadFile(pathToOrder);

            printWindow.webContents.on('did-finish-load', () => {

                const options = {
                    silent: true,
                    deviceName: bodyContent.deviceName,
                    margins: {
                        marginType: "custom",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }
                    // pageRanges: [{
                    //     from: 0,
                    //     to: 0
                    // }]
                }

                printWindow.webContents.print(options, (success, errorType) => {
                    if (success) {
                        res.status(200).send({ status: success })
                    } else {
                        res.status(500).send({ status: success })
                    }
                    printWindow.close()
                })
            })

        } else {
            res.status(500).send({ status: false })
        }

    })
}

module.exports = Server;