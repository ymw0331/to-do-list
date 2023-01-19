const express = require( "express" );
const bodyParser = require( "body-parser" );
const app = express();
const mongoose = require( "mongoose" );
const _ = require( "lodash" );
const dotenv = require( "dotenv" ).config();

const db_user = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;

app.set( 'view engine', 'ejs' );
app.use( bodyParser.urlencoded( { extended: true, useNewUrlParser: true } ) );
app.use( express.static( "public" ) );

// mongoose.connect(
//     `mongodb+srv://${ db_user }:${ db_password }@cluster0.soaw7.mongodb.net/todolistDB`, { useNewUrlParser: true, useUnifiedTopology: true } );

mongoose.set( 'strictQuery', false );
const connectDB = async () =>
{
    try
    {
        const conn = await
            mongoose.connect( process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } ){
            console.log( "MongoDB Connected" );
        }

    } catch ( error )
    {
        console.log( "DB Error => ", err );
    }
};



const itemsSchema = {
    name: String
};

const Item = mongoose.model( "Item", itemsSchema );

const item1 = new Item( {
    name: "Clean bathroom"
} );

const item2 = new Item( {
    name: "Finish tutorial"
} );

const item3 = new Item( {
    name: "Update resume"
} );

const defaultItems = [ item1, item2, item3 ];

const listSchema = {
    name: String,
    items: [ itemsSchema ]
};

const List = mongoose.model( "List", listSchema );


app.get( "/", function ( req, res )
{


    //add new items to collection
    Item.find( {}, function ( err, foundItems )
    {
        // console.log(foundItems)

        if ( foundItems.length === 0 )
        {
            Item.insertMany( defaultItems, function ( err )
            {
                if ( err )
                {
                    console.log( err );
                } else
                {
                    console.log( "Documents are successfully inserted to DB!" );
                }
            } );
            res.redirect( "/" ); //after doc added to DB, it wont show, redirect it to home route and render the foundItems 
        } else
        {
            res.render( "list", { listTitle: "Today", newListItems: foundItems } );
        }
    } );

    // console.log(date())
    //added () to date to initilise/activate function 
    // const day = date.getDate()

    //items(array) is removed, pass in Item collection
} );

//dynamic route 
app.get( "/:customListName", function ( req, res )
{

    const customListName = _.capitalize( req.params.customListName );

    List.findOne( { name: customListName }, function ( err, foundList )
    {
        if ( !err )
        {
            if ( !foundList )
            {
                console.log( "Doesn't exist" );
                //create new list
                const list = new List( {
                    name: customListName,
                    items: defaultItems
                } );
                list.save();
                res.redirect( "/" + customListName );

            } else
            {
                console.log( "Exist" );
                //show existing list
                res.render( "list", { listTitle: foundList.name, newListItems: foundList.items } );
            }
        }
    } );
} );


//add new item to list
app.post( "/", function ( req, res )
{
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item( {
        name: itemName
    } );

    if ( listName === "Today" )
    {
        newItem.save();
        res.redirect( "/" );
    } else
    {
        List.findOne( { name: listName }, function ( err, foundList )
        {
            foundList.items.push( newItem );
            foundList.save();
            res.redirect( "/" + listName );
        } );
    }

    // if (listType === "Work") {
    //     workItems.push(item)
    //     res.redirect("/work")
    // } else {
    //     items.push(item)
    //     res.redirect("/")
    // }
} );


//delete item by checkbox
app.post( "/delete", function ( req, res )
{
    const checkedItemId = req.body.checkbox;
    // console.log(checkedItemId)
    const listName = req.body.listName;

    if ( listName === "Today" )
    {
        Item.findOneAndDelete( { _id: checkedItemId }, function ( err )
        {
            if ( err )
            {
                console.log( err );
            } else
            {
                console.log( "Successfully deleted checked items" );
                res.redirect( "/" );
            }
        } );
    } else
    {
        //name,update(use pull operator, identify by array items id),callback
        List.findOneAndUpdate( { name: listName }, { $pull: { items: { _id: checkedItemId } } }, function ( err, foundList )
        {
            res.redirect( "/" + listName );
        } );
    }

    //Deprecated Warning!
    // Item.findByIdAndRemove({_id: checkedItemId}, function (err) {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log("Successfully deleted checked items")
    //         res.redirect("/")
    //     }
    // })
} );


app.post( "/work", function ( req, res )
{
    const item = req.body.newItem;
    workItems.push( item );
    res.redirect( "/work" );
} );

app.get( "/about", function ( req, res )
{
    res.render( "about" );
} );

let port = process.env.PORT;
if ( port == null || port == "" )
{
    port = 8000;
}


app.listen( port, function ()
{
    console.log( "Server is up and running at port " + port + " successfully" );
} );
