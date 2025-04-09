interface DeviceInt {
  device_id: string;
  name: string;
  key: string;
}

class Main implements EventListenerObject, GETResponseListener {
  api = new API(); // Asegúrate de que la clase API esté implementada correctamente
  view = new ViewMainPage(); // La clase ViewMainPage también debe estar implementada correctamente
  devices: DeviceInt[] = []; // Inicializa el array de devices

  constructor() {}

  // Método para manejar la respuesta de la API
  handleGETResponse(status: number, response: string): void {
    try {
      this.devices = JSON.parse(response); // Convierte la respuesta en dispositivos
      this.view.showDevices(this.devices, this); // Muestra los dispositivos
    } catch (error) {
      console.error('Error al procesar la respuesta:', error);
    }
  }

  // Método principal que hace la solicitud GET al servidor
  main(): void {
    this.api.requestGET('device', this); // Solicita los dispositivos desde el endpoint /device
    const boton = document.getElementById('boton');
    if (boton) {
      boton.addEventListener('click', this); // Asocia el evento de clic al botón
    }
  }

  // Maneja eventos (en este caso, el clic en el botón)
  handleEvent(evt: Event): void {
    const target = <HTMLElement>evt.target; // Asegura que target es un elemento HTML
    const type = evt.type;

    if (target.id === 'boton') {
      console.log('Se hizo clic en el botón');
      this.api.requestGET('device', this); // Vuelve a hacer la solicitud GET para obtener los dispositivos
    }
  }
}

// Cuando se carga la ventana, inicializa la aplicación
window.onload = function () {
  const main: Main = new Main(); // Crea una instancia de la clase Main
  main.main(); // Ejecuta el método principal
};
