import React from "react";
import { format } from "date-fns";
import { Paper, Typography, Link } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PaymentIcon from "@mui/icons-material/Payment";
import PublicIcon from "@mui/icons-material/Public";




function PaymentReceipt({ paymentData }) {
  if (!paymentData) {
    
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm:ss");
  };


  const {
    id,
    date_last_updated,
    transaction_amount,
    status,
    payer,
    payment_method_id,
    point_of_interaction,
    notification_url,
  } = paymentData;

  const paperStyle = {
    maxWidth: 400,
    padding: "16px",
    margin: "auto",
    marginTop: "32px",
  };

  const titleStyle = {
    marginBottom: "16px",
   
  };

  const itemStyle = {
    marginBottom: "8px",
    display: "flex",
    alingItems: 'center'
  };

  return (
    <Paper elevation={3} style={paperStyle}>
      <Typography variant="h5" style={titleStyle}>
        Comprovante de Pagamento
      </Typography>
      <Typography style={itemStyle} >
        <ConfirmationNumberIcon /> <strong>ID do Pagamento:</strong> {id}
      </Typography>
      <Typography style={itemStyle}>
        <AccessTimeIcon /> <strong>Data de Aprovação:</strong>{" "}
        {date_last_updated && typeof date_last_updated === "string"
          ? formatDate(date_last_updated)
          : ""}
      </Typography>
      <Typography style={itemStyle}>
        <AttachMoneyIcon /> <strong>Valor:</strong> {transaction_amount || ""}
      </Typography>
      <Typography style={itemStyle}>
        <PaymentIcon /> <strong>Status:</strong>{" "}
        {status && typeof status === "string" ? status : ""}
      </Typography>
      <Typography style={itemStyle}>
        <AccountCircleIcon /> <strong>Pagador:</strong>{" "}
        {payer && payer.email && typeof payer.email === "string"
          ? payer.email
          : ""}
      </Typography>
      <Typography style={itemStyle}>
        <MonetizationOnIcon /> <strong>Método de Pagamento:</strong>{" "}
        {payment_method_id}
      </Typography>
      
      <Typography style={itemStyle}>
        <PublicIcon /> <strong>Web site:</strong>{" "}
        {notification_url && typeof notification_url === "string" ? (
          <Link href={notification_url} target="_blank">
            {notification_url}
          </Link>
        ) : (
          ""
        )}
      </Typography>
    </Paper>
  );
}

export default PaymentReceipt;
