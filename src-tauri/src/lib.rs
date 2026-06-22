use tauri::{
    menu::MenuBuilder,
    tray::TrayIconBuilder,
    Manager,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let menu = MenuBuilder::new(app)
                .text("open_menu", "Open Menu")
                .text("open_overlay", "Open Overlay")
                .text("close_overlay", "Close Overlay")
                .separator()
                .text("quit", "Quit App")
                .build()?;

            TrayIconBuilder::new()
                .tooltip("Overlay Companion")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app_handle, event| {
                    match event.id().as_ref() {
                        "open_menu" => {
                            if let Some(window) = app_handle.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "open_overlay" => {
                            println!("Open Overlay clicked");
                        }
                        "close_overlay" => {
                            if let Some(window) = app_handle.get_webview_window("overlay") {
                                let _ = window.close();
                            }
                        }
                        "quit" => {
                            println!("Quit App clicked");
                        }
                        _ => {}
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}