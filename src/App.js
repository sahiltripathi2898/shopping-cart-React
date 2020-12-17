import React, { useState, useEffect } from 'react';

/////////////// Material UI Components
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

//////////////////////// JSON Data  /////////////////////////
const data = [
	{
		id: 9090,
		name: 'Item1',
		price: 200,
		discount: 10,
		type: 'fiction',
		img_url: 'https://place-hold.it/40.jpg',
	},
	{
		id: 9091,
		name: 'Item2',
		price: 250,
		discount: 15,
		type: 'literature',
		img_url: 'https://place-hold.it/40.jpg',
	},
	{
		id: 9092,
		name: 'Item3',
		price: 320,
		discount: 5,
		type: 'literature',
		img_url: 'https://place-hold.it/40.jpg',
	},
	{
		id: 9093,
		name: 'Item4',
		price: 290,
		discount: 0,
		type: 'thriller',
		img_url: 'https://place-hold.it/40.jpg',
	},
	{
		id: 9094,
		name: 'Item5',
		price: 500,
		discount: 25,
		type: 'thriller',
		img_url: 'https://place-hold.it/40.jpg',
	},
	{
		id: 9095,
		name: 'Item6',
		price: 150,
		discount: 5,
		type: 'literature',
		img_url: 'https://place-hold.it/40.jpg',
	},
	{
		id: 9096,
		name: 'Item7',
		price: 700,
		discount: 22,
		type: 'literature',
		img_url: 'https://place-hold.it/40.jpg',
	},
	{
		id: 9097,
		name: 'Item8',
		price: 350,
		discount: 18,
		type: 'fiction',
		img_url: 'https://place-hold.it/40.jpg',
	},
];

////////// Styling ////////////
const useStyles = makeStyles({
	table: {
		minWidth: 450,
	},
	root: {
		marginBottom: '100px',
	},
	paper: {
		width: '300px',
		height: '200px',
		margin: '10px',
	},
});

//////// Add quantity 1 to every item of the JSON data
function dataWithQuantity(data) {
	var curr = data;
	for (var i = 0; i < curr.length; i++) {
		curr[i] = { ...curr[i], quantity: 1 };
	}
	return curr;
}

/////////////////////////////////// Main App //////////////////////////////////////
export default function App() {
	const classes = useStyles(); // For using the styles defined above

	////////// Items array (Get items data from above initially after that from local storage)
	const [items, setItems] = useState(
		JSON.parse(localStorage.getItem('ItemsData')) || dataWithQuantity(data)
	);
	/////////// Count of total items
	const [itemsCount, setItemsCount] = useState(0);

	////////// Price Total and Discount variables
	const [itemTotal, setItemTotal] = useState(0);
	const [discount, setDiscount] = useState(0);
	const [typeDiscount, setTypeDiscount] = useState(0);
	const [finalPrice, setFinalPrice] = useState(0);

	////////// Notification Visibility and Name of item removed
	const [visibleNotf, setVisibleNotf] = useState('none');
	const [removedItem, setRemovedItem] = useState('');

	//////////Set count of total items and Store the curr items list in the local storage
	useEffect(() => {
		var curr = [...items];
		var itemCount = 0;
		for (var i = 0; i < curr.length; i++) {
			itemCount += curr[i].quantity;
		}
		setItemsCount(itemCount);
		localStorage.setItem('ItemsData', JSON.stringify(curr));
	}, [items]);

	////////// Update the price and discount every time there is a change in items array
	useEffect(() => {
		var curr = [...items];
		var i = 0,
			val = 0;
		// Calculate item total
		var currTotal = 0;
		for (i = 0; i < curr.length; i++) {
			val = curr[i].price * curr[i].quantity;
			currTotal += val;
		}
		currTotal = currTotal.toFixed(2); // Rounding till 2 decimal place
		setItemTotal((old) => currTotal);

		// Calculate discount total
		var currDiscount = 0;
		for (i = 0; i < curr.length; i++) {
			val = curr[i].discount * curr[i].quantity;
			currDiscount += val;
		}
		currDiscount = currDiscount.toFixed(2);
		setDiscount((old) => currDiscount);

		// Calculate type discount total
		var currTypeDiscount = 0;
		for (i = 0; i < curr.length; i++) {
			if (curr[i].type === 'fiction') {
				currTypeDiscount += curr[i].price * curr[i].quantity * 0.15;
			}
		}
		currTypeDiscount = currTypeDiscount.toFixed(2);
		setTypeDiscount((old) => currTypeDiscount);

		// Calculate Final Price
		var currFinalPrice = currTotal - currDiscount - currTypeDiscount;
		setFinalPrice((old) => currFinalPrice);
	}, [items]);

	////////// Delete Item Handler
	const deleteItem = (index) => {
		var curr = [...items];
		setRemovedItem(curr[index].name);
		setVisibleNotf('');
		curr.splice(index, 1);
		setTimeout(() => {
			setVisibleNotf('none');
		}, 2000);
		setItems(curr);
	};

	////////// Increase the Quantity of item handler
	const increaseQuantity = (index) => {
		var curr = [...items];
		curr[index].quantity += 1;
		setItems(curr);
	};

	////////// Decrease the Quantity of item handler
	const decreaseQuantity = (index) => {
		var curr = [...items];

		// Check if quantity is already 1 , if yes delete that item from items array as quantity will be zero
		if (curr[index].quantity === 1) {
			setVisibleNotf('');
			setRemovedItem(curr[index].name);
			curr.splice(index, 1);
			setTimeout(() => {
				setVisibleNotf('none');
			}, 2000);
		}
		// Else decrease the quantity
		else {
			curr[index].quantity -= 1;
		}

		setItems(curr);
	};

	return (
		<div className={classes.root}>
			<Grid container spacing={3} justify="center" direction="row-reverse">
				<Grid item xs={12}>
					<Typography
						variant="h3"
						style={{ textAlign: 'center', fontWeight: '600' }}
					>
						Shopping Cart
					</Typography>
				</Grid>
				{/* //////////////////////Cart Div///////////////////////*/}
				<Grid item xs={12} md={3}>
					<Paper
						className={classes.paper}
						elevation={8}
						style={{ marginTop: '80px' }}
					>
						<Grid container spacing={0}>
							<Grid item xs={12}>
								<Typography
									variant="h6"
									style={{ margin: '10px 0px 0px 20px', fontWeight: '600' }}
								>
									Total
								</Typography>
							</Grid>
							<Grid item xs={5}>
								<Typography
									variant="body1"
									style={{ margin: '10px 0px 0px 20px' }}
								>
									Items ({itemsCount})
								</Typography>
							</Grid>
							<Grid item xs={2}>
								<span style={{ float: 'right', marginTop: '10px' }}>:</span>
							</Grid>
							<Grid item xs={5}>
								<Typography
									variant="body1"
									style={{ margin: '10px 20px 0px 10px', float: 'right' }}
								>
									${itemTotal}
								</Typography>
							</Grid>

							<Grid item xs={5}>
								<Typography
									variant="body1"
									style={{ margin: '20px 0px 0px 20px' }}
								>
									Discount
								</Typography>
							</Grid>
							<Grid item xs={2}>
								<span style={{ float: 'right', marginTop: '22px' }}>:</span>
							</Grid>
							<Grid item xs={5}>
								<Typography
									variant="body1"
									style={{ margin: '20px 20px 0px 10px', float: 'right' }}
								>
									- ${discount}
								</Typography>
							</Grid>

							<Grid item xs={5}>
								<Typography
									variant="body1"
									style={{ margin: '2px 0px 10px 20px' }}
								>
									Type Discount
								</Typography>
							</Grid>
							<Grid item xs={2}>
								<span style={{ float: 'right', marginTop: '5px' }}>:</span>
							</Grid>
							<Grid item xs={5}>
								<Typography
									variant="body1"
									style={{ margin: '2px 20px 10px 10px', float: 'right' }}
								>
									- ${typeDiscount}
								</Typography>
							</Grid>

							<Grid item xs={5} style={{ backgroundColor: '#c5c9d1' }}>
								<Typography
									variant="body1"
									style={{ margin: '15px 0px 15px 20px' }}
								>
									Item Total
								</Typography>
							</Grid>
							<Grid item xs={2} style={{ backgroundColor: '#c5c9d1' }}>
								<span style={{ float: 'right', marginTop: '16px' }}>:</span>
							</Grid>
							<Grid item xs={5} style={{ backgroundColor: '#c5c9d1' }}>
								<Typography
									variant="body1"
									style={{ margin: '15px 20px 15px 10px', float: 'right' }}
								>
									${finalPrice}
								</Typography>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				{/* /////////////////////////////Cart Div end//////////////////////// */}
				{/* /////////////////////////////Item Listing Div /////////////////// */}
				<Grid item xs={12} md={5}>
					<Typography
						variant="h4"
						style={{ margin: '20px 0px', fontWeight: '600' }}
					>
						<Button variant="text">Back</Button>Order Summary
					</Typography>
					<TableContainer component={Paper} elevation={5}>
						<Table className={classes.table} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Items ({itemsCount})</TableCell>
									<TableCell align="center">Quantity</TableCell>
									<TableCell align="center">Price</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{items.map((item, index) => (
									<TableRow key={item.id}>
										<TableCell
											component="th"
											scope="row"
											style={{ padding: '10px' }}
										>
											<Paper style={{ height: '50px' }}>
												<Grid container>
													<Grid item xs={4}>
														<img
															src={item.img_url}
															style={{ margin: '5px 5px' }}
															alt="items-images"
														></img>
													</Grid>
													<Grid item xs={4} style={{ marginTop: '12px' }}>
														{item.name}
													</Grid>
													<Grid item xs={4}>
														<Button
															variant="text"
															color="primary"
															onClick={() => deleteItem(index)}
															style={{
																padding: '2px',
																width: '5px',
																marginTop: '10px',
																float: 'right',
															}}
														>
															X
														</Button>
													</Grid>
												</Grid>
											</Paper>
										</TableCell>
										<TableCell
											align="center"
											style={{ padding: '2px', fontSize: '15px' }}
										>
											<Button
												variant="text"
												color="primary"
												onClick={() => decreaseQuantity(index)}
												style={{ fontSize: '22px' }}
											>
												-
											</Button>
											{item.quantity}
											<Button
												variant="text"
												color="primary"
												onClick={() => increaseQuantity(index)}
												style={{ fontSize: '20px' }}
											>
												+
											</Button>
										</TableCell>
										<TableCell align="center" style={{ padding: '2px' }}>
											${item.price}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							localStorage.clear();
							window.location.reload();
						}}
						style={{ marginTop: '20px' }}
					>
						Reload Cart
					</Button>
				</Grid>
				{/* /////////////////////////////Item Listing Div End //////////////////////// */}
			</Grid>
			<div
				style={{
					display: visibleNotf,
					position: 'fixed',
					right: '0',
					top: '0',
					height: '70px',
					width: '200px',
					backgroundColor: '#c0eb9b',
					borderRadius: '10px',
					marginRight: '20px',
					marginTop: '20px',
				}}
			>
				<Typography
					style={{ textAlign: 'center', marginTop: '18px' }}
					variant="h6"
				>
					{removedItem} is removed !
				</Typography>
			</div>
		</div>
	);
}
