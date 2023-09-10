-- Assign new cart to user/customer
CREATE OR REPLACE PROCEDURE rokomari.ASSIGN_NEW_CART(UID IN NUMBER) IS
    CID NUMBER;
BEGIN
    INSERT INTO ROKOMARI.cart(customer_id)
   	VALUES(UID) RETURNING cart_id INTO CID;
   	
    UPDATE ROKOMARI.CUSTOMER  SET cart_id = CID WHERE CUSTOMER_ID = UID;
END;
--UID-> USERID/ CUSTOMER ID 
--DID-> DISCOUNT ID
--CID-> CART ID

CREATE OR REPLACE PROCEDURE rokomari.CREATE_ORDER(UID IN NUMBER, DID IN NUMBER ) IS
    CID             NUMBER;
    PRICE_VALUE     NUMBER;
    ITEM_COUNT      NUMBER;
    DISCOUNT_VALUE NUMBER;
    STOCK_CHK       NUMBER;
    BID             NUMBER;
    AMNT            NUMBER;
    CAP_VALUE NUMBER;

BEGIN
	-- TAKING CART ID
    SELECT cart_id INTO CID FROM ROKOMARI.CUSTOMER WHERE CUSTOMER_ID = UID;
   
   -- TOTAL PRICE 
    SELECT SUM(B.price * P.AMOUNT)
    INTO PRICE_VALUE
    FROM ROKOMARI.PICKED p 
             JOIN ROKOMARI.BOOK b  ON P.BOOK_ID  = B.BOOK_ID 
    WHERE P.cart_id = CID;
   
   	-- TOTAL ITEMS
    SELECT SUM(AMOUNT)
    INTO ITEM_COUNT
    FROM ROKOMARI.picked P 
    WHERE P.cart_id = CID;
   
   
    IF ITEM_COUNT IS NULL THEN
        RETURN;
    end if;
   
    IF ITEM_COUNT <= 0 THEN
        RETURN ;
    end if;

    -- Check for stock availibity
    STOCK_CHK := HAS_STOCK(CID);
    IF STOCK_CHK = 0 THEN
        RETURN ;
    end if;

    -- Update total price after adding voucher
    IF DID IS NOT NULL THEN
        SELECT percentage INTO DISCOUNT_VALUE
        FROM ROKOMARI.DISCOUNT d  WHERE d.DISCOUNT_ID  = DID AND d.VALIDITY >sysdate;

        SELECT CAP INTO CAP_VALUE
        FROM ROKOMARI.DISCOUNT d  WHERE d.DISCOUNT_ID  = DID AND d.VALIDITY>sysdate;

        PRICE_VALUE := PRICE_VALUE - LEAST( PRICE_VALUE*DISCOUNT_VALUE/100,CAP_VALUE );
        PRICE_VALUE := CEIL(PRICE_VALUE);
       
    end if;

    -- Insert into order
    INSERT INTO ROKOMARI.ORDER_TABLE ot (cart_id, DISCOUNT_ID, total_price, total_item, CREATED_AT , customer_id) VALUES (CID, DID, PRICE_VALUE+50, ITEM_COUNT, SYSDATE, UID );

    ASSIGN_NEW_CART(UID);
end;
/
--checking it the update is valid or not 
CREATE OR REPLACE PROCEDURE rokomari.Book_update_check (id NUMBER , prc IN NUMBER , stc IN NUMBER ) IS 

BEGIN 
	
	IF prc >=0 AND stc>=0 THEN 
		 UPDATE rokomari.BOOK SET PRICE = prc , STOCK = stc WHERE BOOK_ID = id;
	END IF ;

END;
/