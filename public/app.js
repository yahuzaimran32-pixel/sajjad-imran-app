let selectedAmount = 0.000003;
let selectedTitle = "Sajjad Imran - Standard Plate";

function setStatus(message, isError = false) {
  const statusBox = document.getElementById("statusBox");
  statusBox.style.display = "block";
  statusBox.textContent = message;
  statusBox.classList.toggle("error", isError);
}

function selectItem(title, amount) {
  selectedTitle = title;
  selectedAmount = amount;
  setStatus("An zabi: " + title + " (" + amount + " Pi)");
}

function initPiSdk() {
  if (window.Pi) {
    try {
      window.Pi.init({ version: "2.0" });
      console.log("Pi SDK initialized");
      return true;
    } catch (error) {
      console.error("Pi SDK init failed:", error);
      return false;
    }
  }
  return false;
}

async function createLocalOrder() {
  const response = await fetch("/api/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item: selectedTitle,
      amount: selectedAmount,
      customerName: "Customer",
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Could not create order.");
  }

  return data.order;
}

async function startPayment() {
  const sdkReady = initPiSdk();

  if (!sdkReady) {
    setStatus("Pi SDK ba a shirya shi ba. Dole a kunna app a cikin Pi browser ko a tara SDK.", true);
    return;
  }

  try {
    const order = await createLocalOrder();

    const paymentData = {
      amount: selectedAmount,
      memo: selectedTitle + " - Kano",
      metadata: {
        orderId: order.orderId,
        item: selectedTitle,
        location: "Kano",
      },
    };

    const callbacks = {
      onReadyForServerApproval: function (paymentId) {
        console.log("Ready for server approval", paymentId);

        fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId,
            orderId: order.orderId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Verification response:", data);
          })
          .catch((err) => console.error("Verification error:", err));
      },

      onReadyForServerCompletion: function (paymentId, txid) {
        console.log("Ready for server completion", paymentId, txid);

        fetch("/api/complete-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.orderId,
            paymentId,
            txid,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              setStatus("An yi nasarar biyan kuɗin odar Sajjad Imran! Nagode sosai.");
            } else {
              setStatus(result.message || "Order completion failed.", true);
            }
          })
          .catch((err) => {
            console.error("Completion error:", err);
            setStatus("An sami matsala wajen kammala biyan kuɗin.", true);
          });
      },

      onCancel: function (paymentId) {
        console.log("Payment canceled", paymentId);
        setStatus("An soke biyan kuɗin.", true);
      },

      onError: function (error, payment) {
        console.error("Payment error", error);
        setStatus("An sami matsala wajen biya: " + (error && error.message ? error.message : "unknown error"), true);
      },
    };

    window.Pi.createPayment(paymentData, callbacks);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Payment failed.", true);
  }
}
