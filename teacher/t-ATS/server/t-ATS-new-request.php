<!DOCTYPE html>
<html>
<?php
		if(!empty($_GET['id']) and !empty($_GET['s']) and !empty($_GET['h'])) {
            $teacher_id = $_GET['id'];
			$session_id = $_GET['s'];
			$received_hash = $_GET['h'];
			
            $session_hash = updateMeta($session_id, $teacher_id);
			newSession($session_hash);
		}

		function newSession($session_hash) {
			
			$session_file_name = "session".$session_hash.".json";
			$fp = fopen($session_file_name, 'w');
			fwrite($fp, "[]");
			fclose($fp);
		}

        function updateMeta($session_id, $teacher_id) {

			$meta_file_name = "meta.json";

            $session_hash = hash('md5', $session_id."Technoboard194021119402241940261".$teacher_id);
            $meta = array('SessionHash' => strval($session_hash), 'DateTime' => strval((int)(time())));

            #Implement Calendar here
			$fp = fopen($meta_file_name, 'w');
			fwrite($fp, json_encode($meta));
			fclose($fp);

            return $session_hash;
        }

?>
</html>