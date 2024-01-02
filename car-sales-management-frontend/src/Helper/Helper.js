export const getPurchaseStatus = (status) => {
    switch (status) {
        case "A":
            return "Available";
        case "S":
            return "Sold";
        default:
            return "";
    }
}

export const getStatus = (status) => {
    switch (status) {
        case "A":
            return "Approved";
        case "R":
            return "Rejected";
        case "I":
            return "Initiated";
        case "P":
            return "Paid";
        case "S":
            return "Sold";
        case "C":
            return "Cancelled";
        default:
            return "";
    }
}

export const getUserRole = (value) => {
    switch (value) {
        case "B":
            return "(Buyer)";
        case "S":
            return "(Seller)";
        default:
            return "";
    }
}

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export const getRole = (value) => {
    switch (value) {
        case "seller": return 'S';
        case "buyer": return 'B';
        case "admin": return 'A';
        default: return null;
    }
}

export const getSellerStatus = (status) => {
    switch(status) {
        case "A" : return "Approved";
        case "R" : return "Rejected";
        case "P" : return "Pending";
        default: return null;
    }
}