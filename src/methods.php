<?php
ini_set('display_errors', '1');

if(!isset($_SESSION)) session_start();

define("DATABASE_MESSAGE_PATH", "../database/log.txt");
define("ROOM_ACTION_TALK", "talk");
define("ROOM_ACTION_LEAVE", "leave");
define("ROOM_ACTION_ENTER", "enter");

class Controller
{
    public function __construct() {}

    function handleIsAuthenticated(): void
    {
        $isAuthenticated = !empty($_SESSION["name"]);
        if (!$isAuthenticated) {
            http_response_code(401);
            echo json_encode([
                "action" => "unauthorized",
                "message" => "O usuário teve a sessão expirada"
            ]);
            exit();
        }
        return;
    }

    function handleLogin(): void
    {
        if (strlen($_POST['name']) > 16)
        {
            http_response_code(422);
            echo json_encode([
                "message" => "O nome não pode exceder 16 caracteres!",
                "action" => "handle_exceeded_16_char"
            ]);
            return;
        } 
        
        // Already authenticated?
        if ($_POST['name'] != "")
        {
            $_SESSION['name'] = stripslashes(htmlspecialchars($_POST['name']));
        }
        
        // Anon user
        if ($_POST['name'] == "")
        {
            $_SESSION['name'] = "Anônimo" . strval(random_int(0, 9999));
        }

        // Append to everyone that the boss is online
        $message = $this->createMessageObject($_SESSION['name'], "Acaba de entrar na sala!", ROOM_ACTION_ENTER);
        $this->appendMessageToFile(DATABASE_MESSAGE_PATH, $message);

        http_response_code(200);
        echo json_encode([
            "message" => "Login efetuado com sucesso, redirecionando...",
            "action" => "handle_sucesssfull_login"
        ]);
    }

    function handleLogout(): void
    {
        // Simple exit message
        $message = $this->createMessageObject($_SESSION['name'], "", ROOM_ACTION_LEAVE);
        $this->appendMessageToFile(DATABASE_MESSAGE_PATH, $message);
        
        session_destroy();
        http_response_code(200);
        echo json_encode([
            "message" => "Obrigado por utilizar ;D",
            "action" => "handle_redirect_to_login"
        ]);
        return;
    }

    function handleGetMessages(): void
    {
        if(file_exists(DATABASE_MESSAGE_PATH) && filesize(DATABASE_MESSAGE_PATH) > 0){
            $contents = file_get_contents(DATABASE_MESSAGE_PATH);
            echo json_encode([
                "payload" => $contents
            ]);
            return;
        }

        http_response_code(200);
        echo json_encode([
            "action" => "fail_retrieve_messages",
            "message" => ""
        ]);
    }

    function handleNewMessage(string $message): void
    {
        $message = $this->createMessageObject($_SESSION["name"], $message, ROOM_ACTION_TALK);
        $this->appendMessageToFile(DATABASE_MESSAGE_PATH, $message);
        
        http_response_code(201);
        echo json_encode([
            "action" => "created",
            "message" => ""
        ]);
    }

    private function appendMessageToFile(string $fileName, object $message): void
    {
        file_put_contents($fileName, json_encode($message) . "\n", FILE_APPEND | LOCK_EX);
    }

    private function createMessageObject(string $sender, string $message, string $roomAction): object
    {
        return (object) [
            "sender" => $sender,
            "receiver" => null,
            "message" => $message,
            "room_action" => $roomAction,
            "timestamp" => date('Y-m-d H:i:s')
        ];
    }
}