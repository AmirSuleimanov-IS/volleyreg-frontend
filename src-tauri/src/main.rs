// В релизной сборке не открывать консольное окно на Windows
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Нативное приложение VolleyReg для гостя: окно с React-приложением (сборка npm run build:tauri),
// которое обращается к бэкенду по IP компьютера в локальной сети (VITE_API_URL в .env.tauri)
fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("ошибка запуска приложения Tauri");
}
