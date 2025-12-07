# 📚 Boi Somahar  
### *A Rokomari-style book marketplace — with a twist*

Boi Somahar is a full-stack **online book-selling platform** built as part of our Database Course project.  
The main objective was to utilize **complex database concepts** — including advanced SQL queries, relational design, and PL/SQL — while building a functional full-stack application.

Unlike traditional platforms, **Boi Somahar does not maintain its own warehouses**.  
Publishers upload their books and handle delivery directly. The platform only forwards orders to the respective publisher.  
This makes it fundamentally different from **Rokomari**, which buys books and stores them before selling.

---

## 🚀 Key Features

### 👥 Role-Based Dashboards  
#### **Publisher Dashboard**
- Create account  
- Add, edit, and manage books  
- View incoming orders  
- Update order and delivery status  

#### **Customer Dashboard**
- Register and browse books  
- Add to cart and place orders  
- See multiple publisher options for the same book  
- Filter and search books easily  

---

## 🔎 Advanced Search System

Customers can search and filter books by:
- Genre  
- Author  
- Publisher  
- Price range  

If a book is published by **multiple publishers**, all versions are shown so customers can choose the **best deal**.

---

## 🛒 Order Flow

1. Customer places an order  
2. System forwards order **directly to the publisher**  
3. Publisher packages & delivers the book  
4. Customer receives updates through dashboard  

No warehousing. No middle storage.

---

## 🧰 Tech Stack

### **Backend**
- Node.js (Express.js)
- OracleDB  
- PL/SQL (stored procedures, triggers, complex queries)

### **Frontend**
- EJS Templates  
- HTML, CSS, JS  

---

## 🗄️ Database Highlights

- Complex relational schema  
- Many-to-many relationships (authors, publishers, books)  
- Stored procedures for order processing  
- Validation triggers  
- Optimized SQL queries  

---
## 🎯 Purpose of the Project

This project was developed to demonstrate:

- Full-stack web development
- Real-world database integration
- Use of PL/SQL & advanced SQL techniques
- Proper system architecture design
