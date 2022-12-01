<?php
include_once("secure.php");

if(!isset($_SESSION)) session_start();

include_once("methods.php");

$controller = new Controller();

sleep(5);

// Unprotected
if (isset($_POST['action']) && $_POST['action'] == 'login')
{
    $controller->handleLogin($_POST['name']); 
    return;
}

// Protected
$controller->handleIsAuthenticated(); 

if (isset($_POST['action']) && $_POST['action'] == 'logout')
{
    $controller->handleLogout();
    return;
}

if (isset($_POST['action']) && $_POST['action'] == 'append_message')
{
    $controller->handleNewMessage($_POST['message']);
    return;
}

if (isset($_GET['action']) && $_GET['action'] == 'retrive_messages')
{
    $controller->handleGetMessages();
    return;
}