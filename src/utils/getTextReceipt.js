module.exports = (order, type) => {
    let day; let month; let hours; let minutes;
    let nameString;
    const opts = {
        minimumFractionDigits: 2,
        style: "currency",
        currency: "BRL",
    };

    // função para delimitar o pedido
    const delimit = (Qty, Variation, Price, Cond) => {
        // exemplo : | 1x -

        let qtyStr = Qty + "x - ";

        if (Cond) {
            qtyStr = "| " + qtyStr;
        }

        // recebe a string do preço, exemplo : R$ 30,00
        let priceStr = "";

        if (Number(Price) > 0) {
            priceStr = Number(Price).toLocaleString("pt-BR", opts);
        }

        // prefix = | 1x - , sufix = resto
        const prefix = qtyStr.length; const sufix = priceStr.length;
        const charsQty = 36 - (prefix + sufix);

        // let test = '| 1x - hambúrguer lol com    R$ 50,00';
        const varSplit = Variation.split(" ");

        let totalLine = 0;
        let variationDesc = "";
        let space = "|";
        let isFirstLine = true;

        for (let i = 0; i < (prefix - 1); i++) {
            space += " ";
        }

        let overflow = 0;
        let auxBlanket = "";
        let auxAddSpace = 0;

        varSplit.forEach((e) => {
            if (((totalLine + e.length) + 1) > charsQty) {
                overflow = 1;
                if (isFirstLine) {
                    const addSpace = totalLine + prefix + sufix;
                    let Blanket = "";
                    for (let i = 0; i < (36 - addSpace); i++) {
                        Blanket += " ";
                    }
                    variationDesc += Blanket + priceStr;
                    auxBlanket = Blanket;
                }
                totalLine = 0;
                variationDesc += "\n" + space + e + " ";
                isFirstLine = false;
            } else if (totalLine == 0) {
                variationDesc += qtyStr + e + " ";
            } else {
                variationDesc += e + " ";
            }
            totalLine += (e.length + 1);
        });

        auxAddSpace = totalLine + prefix + sufix;

        if (overflow == 0) {
            for (let i = 0; i < (36 - auxAddSpace); i++) {
                auxBlanket += " ";
            }
            variationDesc += auxBlanket + priceStr;
        }
        return variationDesc;
    };

    // função que delimita qualquer String
    const delimitName = (name) => {
        let formatName = "";
        const fcontrolLine = 36;
        let cut = fcontrolLine;

        const names = name.split(" ");

        if (name.length > fcontrolLine) {
            names.forEach((n) => {
                if (formatName.length + (n + 1).length > cut) {
                    while (formatName.length < cut) {
                        formatName += " ";
                    }

                    formatName += "\n" + n + " ";
                    cut += fcontrolLine;
                } else {
                    formatName += n + " ";
                }
            });
        } else {
            formatName = name;
        }
        return formatName;
    };

    // Função para formatar o telefone
    const delimitPhone = (phone) => {
        phone = order.customer.phone.split("");
        let newPhone = "";

        for (let i = 0; i < phone.length; i++) {
            if (i != phone.length - 4) {
                newPhone += phone[i];
            } else {
                newPhone += "-" + phone[i];
            }
        }
        return newPhone;
    };

    const orderData = (data, especific, table, drivethru) => {
        let text = "";

        if (data === "delivery") {

            const streetAndNumber = `${order.method.data.address}, ${order.method.data.number}`;
            let feeRow = '';

            if (order.feeOutside) {
                feeRow = "Taxa a combinar";
            } else {
                if (order.fee.price === 0) {
                    feeRow = "Entrega GRÁTIS";
                } else {
                    feeRow = "Taxa de entrega: " + Number(order.fee.price).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                }
            }

            if (order.method.data.formatted) {
                text += `Entrega: \n${delimitName(order.method.data.formatted)}\nNumero: ${order.method.data.number}`;
            } else {
                text += `Entrega: \n${delimitName(streetAndNumber)}`;

                if (order.method.data.neighborhood != "") {
                    text += `\n${delimitName(order.method.data.neighborhood)}`;
                } else text += `\n${delimitName(order.method.data.district)}`;
            }

            if (order.method.data.complement !== "") {
                const complement = `\nComplemento: ${order.method.data.complement}`;
                text += delimitName(complement);
            }

            text += "\n------------------------------------\n" + feeRow;

        } else if (data === "balcony") {
            text = "Retirada no balcão";
        } else if (data === "table") {
            text = `Mesa: ${table}`;
        } else {

            if (order.method.data.model) {
                text += `Carro \nModelo: ${order.method.data.model} \nCor: ${order.method.data.color} \nPlaca: ${order.method.data.id}`;
            } else {
                text += `Carro \nPlaca: ${order.method.data.id} \n`;
            }

        }
        return text;
    };

    let itensReceipt = "";
    let slugName = "Loja: " + order.store_name;
    const storeName = slugName.toUpperCase();
    const code = order.code;
    nameString = order.customer.name;
    const phone = order.customer.phone;

    const total = Number(order.totalCart).toLocaleString("pt-BR", opts);

    let orderDate = 0;

    if (order.timestamp.seconds) {
        orderDate = order.timestamp.seconds;
    } else {
        orderDate = order.timestamp._seconds;
    }

    const date = new Date(orderDate * 1000);

    if (order.gmt) {
        date.setHours(date.getHours() - order.gmt);
    }

    hours = date.getHours();
    minutes = date.getMinutes();
    day = date.getDate();
    month = date.getMonth() + 1;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    order.itens.forEach((item) => {

        itensReceipt += "====================================\n" +
            delimitName(item.name).toUpperCase() + "\n" +
            "====================================\n";

        let itensLength = item.itens.length;
        let itensLengthCounter = 1;

        item.itens.forEach((prod) => {

            let prodPrice = prod.price;

            if (prod.price_promo && prod.price_promo > 0) {
                prodPrice = prod.price_promo;
            }

            itensReceipt += delimit(
                prod.total,
                prod.name,
                prodPrice,
                false
            ) + "\n";

            const attrKeys = prod.attributes;

            if (attrKeys) {
                attrKeys.forEach((attr) => {
                    if (type !== "simple") {
                        itensReceipt += delimitName("| " +
                            attr.name) + "\n";
                    }

                    const Vars = attr.itens;

                    Vars.forEach((variation) => {
                        itensReceipt += delimit(
                            variation.total,
                            variation.name,
                            variation.price,
                            true
                        ) + "\n";
                    });
                });
            }

            if (prod.obs) {
                const obs = "Obs.: " + prod.obs;
                itensReceipt += delimitName(obs) + "\n";
            }

            if (itensLengthCounter < itensLength) {
                itensReceipt += "++++++++++++++++++++++++++++++++++++\n";
            }

            itensLengthCounter++;
        });
    });

    nameString = delimitName(nameString);

    const newPhone = delimitPhone(phone);
    const newStoreName = delimitName(storeName);

    let orderAddress = '', orderNumber = '', orderCar = '';

    if (order.method.data && order.method.data.address) { orderAddress = order.method.data.address }
    if (order.method.data && order.method.data.number) { orderNumber = order.method.data.number }
    if (order.method.data && order.method.data.model) { orderCar = order.method.data.id }

    const orderType = orderData(order.method.type,
        orderAddress,
        orderNumber,
        orderCar
    );

    let paymentType = '';

    if (order.payment) {

        const toReal = (vl) => { return Number(vl).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) };

        order.payment.forEach(payment => {

            if (payment.type == 'creditcard') {

                let optionsCreditCard = {
                    creditAmex: "Crédito Amex",
                    creditElo: "Crédito Elo",
                    creditMasterCard: "Crédito MasterCard",
                    creditDiners: "Crédito Diners",
                    creditVisa: "Crédito Visa",
                    creditHiperCard: "Crédito HiperCard ",
                    debitElo: "Débito Elo",
                    debitMasterCard: "Débito MasterCard",
                    debitVisa: "Débito Visa",
                    ticketRefeicao: "Ticket Refeição",
                    benRefeicao: "Ben Refeição",
                    sodexoRefeicao: "Sodexo Refeição",
                    aleloRefeicao: "Alelo Refeição",
                    vrRefeicao: "vR Refeição",
                    debitBanrisul: "Banrisul Débito",
                    dayBanrisul: "Banrisul 30 dias",
                    banriCard: "BanriCard",
                    refeisul: "Refeisul",
                }

                let cardType = '';

                if (payment.data && payment.data.option) {
                    cardType = optionsCreditCard[payment.data.option];
                }

                paymentType += delimitName('Máquina de cartão: ' + cardType + ' ' + toReal(payment.amount));

            } else if (payment.type == 'pix') {
                paymentType += 'Pagamento via PIX ' + toReal(payment.amount);
            } else if (payment.type == 'mercadopago') {
                paymentType += 'Pagamento online via Mercado Pago ' + toReal(payment.amount);
            } else if (payment.type == 'money') {
                paymentType += 'Pagamento em dinheiro ' + toReal(payment.amount);

                if (payment.data && payment.data.change) {
                    if (Number(payment.data.change - payment.amount) > 0) {
                        paymentType += '\nValor entregue: ' + toReal(payment.data.change) +
                            '\nTrocado: ' + toReal(payment.data.change - payment.amount)

                    } else if (Number(payment.data.change - payment.amount) == 0) {
                        paymentType += '\nSem troco'

                    }
                }
            };

            //paymentType += '\n';
            paymentType += "\n------------------------------------\n";

        })
    }

    let totalPaymentGroup = "";

    if (order.discounts) {
        order.discounts.forEach(discount => {
            let addDiscount = 0;

            if (discount.format == "percent") {
                addDiscount = (Number(discount.value) * Number(order.totalItens)) / 100;
            } else {
                addDiscount = Number(discount.value);
            }

            addDiscount -= (addDiscount * 2);

            totalPaymentGroup += discount.name + ': ' + Number(addDiscount).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "\n";
        })
    }

    if (order.taxes) {
        order.taxes.forEach((e) => {
            let addTax = 0;

            if (e.type == "%") {
                addTax = (Number(e.value) * Number(order.total_order)) / 100;
            } else {
                addTax = e.value;
            }
            totalPaymentGroup += e.name + ": " + Number(addTax).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "\n";
        });
    }

    totalPaymentGroup += "Total: " + total;

    return newStoreName + "\n" +
        "|#" + code + "               " + day + "/" + month +
        " as " + hours + ":" + minutes + "|\n" +
        itensReceipt +
        "------------------------------------\n" +
        "Em nome de:\n" +
        nameString + "\n" +
        newPhone + "\n" +
        "------------------------------------\n" +
        orderType + "\n" +
        "------------------------------------\n" +
        paymentType + "\n" +
        totalPaymentGroup + "\n" +
        "------------ZAP  DELIVERY-----------\n";
};



