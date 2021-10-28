import React from "react";
import { Box } from "@advisable/donut";

function LetterboxIllustration({ color = "#FFCE00", ...props }) {
  return (
    <Box as="svg" fill="none" viewBox="0 0 1000 1000" {...props}>
      <path
        fill="#232323"
        d="M801.184 447.305c-7.497 16.151.598 37.691 16.875 44.914 8.752 3.92 18.748 3.861 28.244 2.587 40.18-5.4 74.421-31.193 104.86-57.947 7.154-6.282 14.808-14.034 14.288-23.52-.578-10.78-11.162-17.797-20.58-23.06"
      ></path>
      <path
        fill="#232323"
        d="M798.9 445.962a38.526 38.526 0 007.458 42.278c13.828 14.396 36.103 12.093 53.763 7.751 19.6-4.831 37.916-14.288 54.586-25.578 8.281-5.615 16.248-11.711 24-18.041 7.752-6.331 16.258-12.74 22.795-20.414 6.223-7.301 9.947-16.542 5.978-25.872-3.783-8.879-12.633-14.484-20.747-18.973-4.116-2.283-7.84 3.969-3.695 6.321 6.174 3.538 13.103 7.458 16.778 13.799 4.586 7.918-.059 15.837-5.684 21.717-11.515 12.014-25.549 22.598-39.122 32.163-13.984 9.859-28.998 18.571-45.217 24.187-15.258 5.272-35.662 10.593-51.068 3.273-14.112-6.703-21.501-25.48-15.248-39.925 1.342-3.087-3.195-5.812-4.587-2.676l.01-.01z"
      ></path>
      <path
        fill="#fff"
        d="M913.011 433.007c-17.091 14.073-122.696 58.506-125.244 17.777-1.725-27.44-16.111-50.881-47.353-44.639-1.902.373-3.92.882-5.743.255-3.234-1.098-4.4-5.067-4.518-8.487a31.302 31.302 0 0112.368-25.735c-8.35 4.695-20.218 1.382-24.941-6.958-4.724-8.339-1.451-20.217 6.86-24.96-11.574.98-26.46 0-30.331-10.927-3.783-10.78 6.654-20.717 10.731-31.36-4.077 2.528-8.321 5.125-13.093 5.664-4.773.539-10.192-1.587-11.878-6.076-1.499-3.988.294-8.398 2.195-12.211 20.453-40.964 60.76-79.438 108.085-84.28 45.08-4.655 88.543 23.697 114.13 61.094 18.395 26.852 28.92 55.252 33.948 86.681 1.087 6.801 2.842 14.023 7.996 18.571 6.125 5.399 16.758 6.997 18.464 14.984.98 4.723-1.96 9.329-4.9 13.122a132.241 132.241 0 01-46.903 37.367"
      ></path>
      <path
        fill="#232323"
        d="M911.237 431.223c-9.368 7.468-21.883 12.162-32.859 16.611-15.856 6.429-32.389 11.898-49.265 14.867-9.947 1.744-27.577 4.724-35.172-4.332-4.42-5.282-3.185-13.994-4.567-20.354-1.96-9.104-5.782-18.101-12.21-24.961-7.341-7.84-17.748-11.613-28.42-11.27-3.136.108-6.145.755-9.242 1.117-3.097.363-5.076.187-5.821-3.263a18.305 18.305 0 010-5.713 28.775 28.775 0 0111.221-19.365c3.136-2.46-.862-6.929-4.077-5.282-6.928 3.537-16.415 1.185-20.335-5.743-3.92-6.929-.901-16.268 5.665-20.355 2.646-1.656 1.803-6.566-1.706-6.282-8.143.657-21.168 1.421-26.175-6.654-5.998-9.672 6.281-22.677 9.8-31.36 1.146-2.803-2.627-5.253-4.959-3.812-3.803 2.342-8.066 5.233-12.74 5.282-5.772.069-8.82-4.096-7.037-9.604 2.372-7.487 7.488-14.837 11.76-21.344a168.869 168.869 0 0132.105-36.378c24.706-20.854 56.909-33.486 89.425-27.587 32.517 5.9 61.064 26.891 80.605 52.92a192.972 192.972 0 0125.568 46.335 210.794 210.794 0 017.929 25.264c2.097 8.477 3.018 17.219 5.154 25.666 2.029 8.046 6.174 14.112 13.436 18.199 3.117 1.754 6.772 3.116 9.428 5.566 4.312 3.969 1.764 8.997-1.166 12.985-11.839 16.092-28.744 28.753-46.599 37.387-4.175 2.009-.53 8.203 3.626 6.204a135.174 135.174 0 0046.618-36.652c4.9-6.116 9.957-14.063 5.263-21.815-3.714-6.145-11.202-7.762-16.66-11.76-8.095-5.939-8.095-18.081-9.879-27.048a220.507 220.507 0 00-8.055-29.675 202.01 202.01 0 00-27.734-52.969c-21.168-28.733-52.724-52.273-88.651-57.673-35.927-5.399-70.619 9.457-97.02 33.32a176.899 176.899 0 00-37.044 47.472c-4.067 7.575-9.32 18.041-.872 24.725 8.193 6.468 18.287 1.715 25.95-3.009l-4.968-3.822c-4.763 11.662-17.523 24.5-8.526 37.495 6.713 9.673 20.893 9.898 31.36 9.055l-1.637-6.291c-9.722 6.056-13.838 19.355-8.085 29.576 5.753 10.222 19.433 13.328 29.547 8.154l-4.116-5.253c-9.241 7.272-16.983 22.305-12.132 34.124 2.283 5.566 7.144 6.575 12.583 5.605 6.262-1.117 12.524-1.597 18.718.177 10.388 2.94 17.405 11.593 21.089 21.413a66.029 66.029 0 013.822 17.11c.334 3.597.52 7.056 2.049 10.388 5.654 12.27 21.697 12.966 33.32 11.927 18.237-1.637 36.044-7.399 52.988-14.092 14.318-5.645 30.184-11.76 42.228-21.668 2.519-2.058-1.058-5.537-3.547-3.558h.019z"
      ></path>
      <path
        fill={color}
        d="M391.749 729.78l12.838 60.015a20.08 20.08 0 0019.6 15.886 20.09 20.09 0 0019.6-15.886l12.838-60.015h-64.876z"
      ></path>
      <path
        fill="#232323"
        d="M148.435 729.78l12.847 60.015a20.071 20.071 0 0019.6 15.886 20.07 20.07 0 0019.6-15.886l12.838-60.015h-64.885zM243.309 729.78l12.838 60.015a20.07 20.07 0 0019.6 15.886 20.072 20.072 0 0019.6-15.886l12.847-60.015h-64.885z"
      ></path>
      <path
        fill={color}
        d="M501.686 729.222l12.838 60.025a20.09 20.09 0 0019.6 15.876 20.092 20.092 0 0019.6-15.876l12.916-60.025h-64.954z"
      ></path>
      <path
        fill={color}
        d="M448.061 257.117A133.096 133.096 0 01581.155 390.24v330.436c0 15.507-12.571 28.077-28.078 28.077H314.938V390.24a133.093 133.093 0 01133.123-133.123z"
      ></path>
      <path
        fill={color}
        d="M261.938 257.117h186.387v491.646H261.938V257.117z"
      ></path>
      <path
        fill="#232323"
        d="M262.223 257.117A133.095 133.095 0 01395.317 390.24v358.513H160.42c-17.287 0-31.301-14.014-31.301-31.301V390.24a133.094 133.094 0 01133.104-133.123zM556.84 422.58H423.501c-8.369 0-6.703-16.748 0-21.766 6.704-5.017 123.882-4.469 133.369 0 9.486 4.469 8.937 21.766-.03 21.766z"
      ></path>
      <path
        fill="#232323"
        d="M556.84 419.229H432.233c-2.558 0-5.233.225-7.781 0-4.998-.441-3.372-7.938-2.009-11.29a10.612 10.612 0 012.753-4.204c.5-.402.196-.177.108-.137a12.26 12.26 0 013.136-.735 103.65 103.65 0 0110.594-1.059c24.324-1.656 48.873-1.46 73.235-.931 11.76.255 23.579.539 35.28 1.686 2.617.255 5.586.362 8.066 1.333-1.186-.461.294.176.451.284a9.063 9.063 0 012.303 2.146 11.656 11.656 0 011.96 5.615c.245 2.539-.206 7.086-3.519 7.292-4.272.264-4.302 6.967 0 6.693 14.818-.98 12.201-24.216.637-28.42-7.036-2.568-15.944-2.166-23.304-2.538-27.999-1.421-56.203-1.529-84.221-.402-8.301.333-17.797 0-25.843 2.411-9.457 2.842-14.337 22.863-4.606 28.018 2.568 1.362 5.88.98 8.683.98H556.84c4.341-.049 4.351-6.742 0-6.742zM563.573 694.442c-45.707 1.431-91.434-2.421-137.141-.657l3.547 3.548c-2.342-74.353-2.685-148.735-.548-223.097l-3.822 3.812c38.801.105 77.596.177 116.384.216h16.553l-3.822-3.822c.568 25.068 1.113 50.133 1.636 75.195l2.568 119.903c.196 9.193.421 18.385.627 27.577.118 5.165 8.144 5.185 8.036 0-.568-25.068-1.153-50.133-1.754-75.195l-2.842-119.893c-.216-9.193-.425-18.385-.627-27.577a3.92 3.92 0 00-3.822-3.822c-38.789-.066-77.584-.138-116.385-.216h-16.552a3.921 3.921 0 00-3.813 3.812c-1.96 74.343-1.793 148.774 1.088 223.097a3.596 3.596 0 003.548 3.548c45.687-2.097 91.463 1.382 137.141-1.049 3.44-.176 3.489-5.488 0-5.38z"
      ></path>
      <path
        fill="#fff"
        d="M151.629 667.119a180.208 180.208 0 00.226 36.495 1.9 1.9 0 00.519 1.343c.342.217.742.323 1.147.304l4.371.196c18.482.803 36.981.882 55.497.235.439.021.874-.085 1.254-.304.45-.44.695-1.047.677-1.676l3.42-32.095a267.17 267.17 0 01-60.045-2.94M213.438 605.194c7.507 1.607 26.352-10.516 33.32-13.72l39.671-18.13c9.055-4.136 67.11-25.951 64.268-33.722a624.097 624.097 0 00-37.122-82.448c-.804-1.479-1.784-3.106-3.421-3.547-1.391-.363-2.832.245-4.135.843a56256.878 56256.878 0 01-126.606 57.584 11.471 11.471 0 00-4.548 3.009c-2.597 3.312-.901 8.114.892 11.927l17.777 37.926 9.359 19.952c1.833 3.92 5.733 17.895 9.31 19.875.386.213.803.365 1.235.451z"
      ></path>
      <path
        fill="#232323"
        d="M179.991 524.912c15.739 5.88 31.36 12.083 47.04 17.895 7.84 2.9 15.719 5.775 23.638 8.624 5.047 1.822 13.632 7.232 18.62 3.038 2.009-1.686 3.008-4.401 4.165-6.674a578.097 578.097 0 005.752-11.594 582.774 582.774 0 0010.045-21.824c6.243-14.367 12.593-29.008 17.013-44.051 1.402-4.773-5.537-6.419-7.291-2.009-5.243 13.181-9.731 26.636-15.161 39.749a665.383 665.383 0 01-9.202 21.177 605.747 605.747 0 01-4.302 9.232c-1.137 2.391-2.724 7.909-4.714 9.663-1.989 1.754-7.085-1.127-9.457-1.96a14401.48 14401.48 0 01-10.917-3.92c-6.978-2.509-13.955-5.018-20.952-7.468-14.289-5.008-28.675-9.721-42.954-14.7-3.126-1.097-4.4 3.783-1.362 4.9l.039-.078z"
      ></path>
      <path
        fill="#232323"
        d="M232.911 583.575a124.177 124.177 0 015.478-16.386c2.225-5.331 5.253-10.27 7.507-15.562a3.027 3.027 0 00-5.223-3.048c-6.939 9.359-10.614 22.305-13.132 33.516-.784 3.489 4.459 4.969 5.37 1.48zM323.933 542.718c-10.123-3.244-20.433-5.939-30.683-8.712-3.587-.98-5.106 4.586-1.529 5.556 10.251 2.764 20.521 5.616 30.899 7.899a2.46 2.46 0 101.313-4.743zM251.845 533.418c-.873 2.038-.451 4.292 1.666 5.37 1.724.882 3.92.089 5.38-.98a9.458 9.458 0 003.538-9.947 8.36 8.36 0 00-8.428-5.88c-3.607.098-8.546 2.676-8.262 6.86a3.148 3.148 0 001.943 2.823 3.15 3.15 0 003.369-.627c1.274-1.196 2.891-3.548 4.723-1.96.98.813.481 4.057-1.117 4.106l1.48.392.637.852v1.47l.069-.372c.568-2.822-3.695-5.125-4.998-2.107z"
      ></path>
      <path
        fill={color}
        d="M709.436 477.293c9.692-1.097 27.498-23.294 34.603-29.939l40.455-37.828c9.231-8.643 70.344-58.339 63.788-66.552a793.262 793.262 0 00-77.979-84.28c-1.568-1.47-3.4-3.028-5.546-2.891-1.823.108-3.313 1.421-4.646 2.666a62362.795 62362.795 0 01-129.222 120.403c-1.715 1.587-3.489 3.253-4.263 5.458-1.794 5.038 2.185 10.134 5.88 14.005l36.71 38.484 19.326 20.267c3.783 3.969 14.122 19.227 19.228 20.178.55.094 1.112.104 1.666.029z"
      ></path>
      <path
        fill="#fff"
        d="M152.101 386.654c36.485 5.38 73.5 2.312 110.122.539 35.986-1.735 72.275-3.038 107.928-8.556 3.841-.598 2.94-7.213-.922-6.86-18.159 1.774-36.26 3.92-54.458 5.145-17.503 1.225-35.035 2.009-52.548 2.94-36.377 1.96-73.078 5.233-109.466 1.852-2.754-.254-3.44 4.469-.656 4.9v.04zM153.972 655.232c10.231.049 20.501.568 30.733.215 3.822-.137 3.822-5.811 0-5.938-10.232-.363-20.502.156-30.733.205-3.558 0-3.558 5.508 0 5.518zM151.836 637.2c6.716.823 13.433 1.626 20.149 2.41 3.773.432 3.812-5.615 0-5.968a2325.13 2325.13 0 00-20.149-1.774c-3.459-.294-3.332 4.9 0 5.332zM151.522 625.44c1.764-.346 3.525-.721 5.282-1.127a2.725 2.725 0 001.882-3.312 2.756 2.756 0 00-3.313-1.882c-1.783.304-3.547.637-5.321.98a2.774 2.774 0 00-1.96 3.391 2.813 2.813 0 003.391 1.96l.039-.01zM336.282 664.826c8.026.725 16.327 1.862 24.382 1.293 3.303-.235 4.587-5.605.833-6.223-8.261-1.342-16.856-1.038-25.215-1.038-3.92 0-3.763 5.625 0 5.968zM339.771 681.673c5.027 1.274 10.682.274 15.395-1.676a3.234 3.234 0 10-2.499-5.88c-3.988 1.784-7.84 1.96-12.152 2.087-3.087.108-3.92 4.714-.744 5.518v-.049zM183.979 489.554c11.241-2.636 22.442-8.399 32.889-13.24a338.947 338.947 0 0032.34-17.042c3.087-1.862.333-6.586-2.822-4.832-10.398 5.763-20.894 11.349-31.654 16.406-10.761 5.056-22.236 8.624-32.732 13.994-2.676 1.372-.774 5.361 1.96 4.714h.019zM256.901 450.422c2.94 0 2.94-4.498 0-4.498s-2.94 4.498 0 4.498z"
      ></path>
      <path
        fill="#232323"
        d="M172.68 579.782c13.779-6.615 27.597-13.191 41.16-20.286 3.469-1.823.421-6.86-3.048-5.224-13.72 6.596-27.303 13.72-40.827 20.806-3.126 1.636-.382 6.203 2.744 4.704h-.029zM191.937 585.113a43.503 43.503 0 0016.581-6.223c3.019-1.891.206-6.732-2.802-4.782a39.733 39.733 0 01-15.19 5.88c-3.381.568-1.96 5.635 1.411 5.125z"
      ></path>
      <path
        fill="#fff"
        d="M255.628 613.837c21.707-9.045 43.786-17.179 65.611-25.931 3.087-1.244 1.832-6.282-1.412-5.096-22.128 8.085-43.708 17.474-65.415 26.607-2.675 1.127-1.509 5.557 1.216 4.42zM240.986 622.686c3.028 0 3.028-4.713 0-4.713s-3.038 4.713 0 4.713z"
      ></path>
      <path
        fill="#232323"
        d="M446.914 664.542c-.118-9.8-.265-19.718-.196-29.567.058-9.251 1.411-18.326.725-27.587-1.441-19.384-3.273-38.523-1.843-57.967l-3.096 3.087a76.318 76.318 0 0117.052.069c4.988.617 5.007 0 4.9 4.665-.059 2.94-.118 5.88-.187 8.741-.264 11.996-.627 23.981-.98 35.976-.303 11.662-.597 23.334-.686 35.006a1094.96 1094.96 0 000 18.483c0 1.558.98 7.84.138 8.761.617-.627-.98 0-1.519 0-1.882.078-3.764.245-5.645.421-4.587.412-4.753 7.419 0 7.272 4.537-.147 11.897.833 13.975-4.381 1.097-2.744.49-6.233.441-9.124a978.981 978.981 0 01-.138-10.701c-.098-15.239.128-30.478.412-45.707.284-14.906.657-29.812.774-44.718 0-6.037-.362-9.398-6.928-10.515a76.847 76.847 0 00-21.678-.402 3.234 3.234 0 00-3.087 3.097c-2.274 19.296.304 38.729 1.901 57.967.774 9.231-.441 18.355-.343 27.587.098 9.868.833 19.737 1.676 29.566.235 2.695 4.302 2.793 4.263 0l.069-.029zM451.461 529.557c-8.369-1.872-8.438-12.623-1.47-16.396 2.813-1.509 6.429-.764 8.957 1.157 4.822 3.636.618 7.271-2.107 10.603-2.234 2.715.5 6.674 3.812 4.949 6.243-3.234 10.261-11.573 5.978-17.943-3.449-5.126-11.76-7.978-17.551-5.959-13.662 4.763-14.906 26.333.98 28.508 3.145.422 4.655-4.184 1.362-4.9l.039-.019z"
      ></path>
      <path
        fill="#232323"
        d="M451.186 521.619a39.231 39.231 0 00.137 11.083c.471 3.401 6.321 2.627 6.037-.823-.265-3.155-.412-6.389-.804-9.535a2.78 2.78 0 00-2.371-2.685 2.694 2.694 0 00-2.999 1.96zM409.997 189.399c0 4.616-.098 9.231 0 13.847.108 3.832 5.88 3.842 5.968 0 .118-4.616.049-9.231 0-13.847 0-3.871-5.997-3.92-6.017 0h.049zM474.697 197.817l-4.724 12.662c-1.411 3.792 4.724 5.497 6.086 1.675l4.508-12.74c1.323-3.714-4.518-5.252-5.88-1.617l.01.02zM518.787 212.047l-5.792 12.681c-1.676 3.675 3.773 6.86 5.439 3.185l5.743-12.74c1.646-3.626-3.724-6.811-5.39-3.156v.03zM374.247 211.331a23.636 23.636 0 003.871 10.731c2.185 3.166 7.399.157 5.194-3.038a19.38 19.38 0 01-3.303-8.477c-.47-3.234-6.154-2.499-5.762.784z"
      ></path>
      <path
        fill="#fff"
        d="M828.967 255.862c-15.68-.509-28.891 10.731-40.425 21.296-5.322 4.9-10.78 10.006-13.377 16.748-2.597 6.742-1.127 15.592 5.096 19.237 5.213 3.048 11.76 1.627 17.64.118l26.46-6.86c2.753 12.554 5.625 25.402 12.602 36.201 6.978 10.8 19.012 19.267 31.831 18.297"
      ></path>
      <path
        fill="#232323"
        d="M828.966 253.324c-12.74-.255-23.422 5.341-33.203 13.093-9.124 7.232-20.884 16.131-24.382 27.773-2.94 9.8 1.323 21.56 12.064 23.893 5.762 1.254 11.76-.383 17.297-1.764 8.202-2.049 16.385-4.156 24.578-6.243l-4.655-2.646c3.087 14.22 6.429 29.047 15.513 40.788 7.84 10.064 19.542 17.218 32.566 16.562 4.9-.245 4.959-7.919 0-7.693-27.44 1.234-36.103-30.616-40.788-51.666a3.831 3.831 0 00-4.645-2.636 12389.84 12389.84 0 00-16.983 4.439c-5.4 1.421-10.888 3.381-16.455 3.989-12.171 1.313-14.925-10.78-9.692-19.679 4.694-7.957 13.25-14.602 20.345-20.354 8.105-6.576 17.64-12.74 28.42-12.74 3.263 0 3.263-5.008 0-5.067l.02-.049zM644.491 391.151a528.311 528.311 0 0089.729-14.788c11.456-2.94 21.854-7.213 24.157-20.08 2.715-15.151 3.303-31.066 4.635-46.403.353-4.077-5.791-3.92-6.281 0-1.725 13.808-3.029 27.665-4.783 41.464-.843 6.605-2.724 11.574-8.977 14.641-5.537 2.724-11.995 3.861-17.934 5.331a641.23 641.23 0 01-80.526 14.573c-3.293.382-3.42 5.527 0 5.262h-.02z"
      ></path>
      <path
        fill="#232323"
        d="M712.18 451.607c3.557-23.333 7.585-46.334 12.74-69.374.842-3.822-4.9-5.458-5.88-1.627a403.784 403.784 0 00-12.054 70.286c-.236 2.94 4.802 3.714 5.262.715h-.068zM758.033 346.14l26.843.568c8.359.177 16.66.255 24.784-1.774 4.067-.98 2.342-7.32-1.735-6.281-8.173 2.067-16.513 2.018-24.902 2.077l-24.99.147c-3.39 0-3.39 5.184 0 5.263zM728.339 344.18a3.558 3.558 0 00-5.184-.98c-1.911 1.362-1.823 3.714-1.186 5.723 1.274 3.979 4.342 8.085 9.105 7.046 4.165-.901 5.811-5.821 5.458-9.653-.46-4.9-4.508-8.359-9.447-7.467-3.92.715-3.097 7.595.98 7.095.588-.069.862-.088 1.196.441.333.529-.177 2.94-.147 3.009.029.068.48.078.46-.177 0 0-.48-.421-.529-.48a5.682 5.682 0 01-1.205-2.852l-.422 1.558-.921.618h-1.499l.352.068c2.107.402 4.401-1.832 3.009-3.92l-.02-.029zM782.69 239.81a42.713 42.713 0 0123.834 6.86c1.724 1.088 3.136-1.519 1.558-2.676a35.733 35.733 0 00-25.706-6.526c-1.362.196-.98 2.342.314 2.352v-.01zM875.878 412.016c9.732-1.235 18.62-6.38 26.901-11.388a164.609 164.609 0 0024.5-18.228c1.382-1.235-.656-3.253-2.028-2.028a169.495 169.495 0 01-23.138 17.483c-8.075 5.027-16.974 10.515-26.529 11.985-1.244.186-.98 2.362.294 2.205v-.029zM853.779 423.462l2.235-1.51a1.518 1.518 0 10-1.529-2.616l-2.225 1.509a1.513 1.513 0 001.519 2.617zM922.694 396.385l1.607-1.303c.493-.5.493-1.304 0-1.804a1.323 1.323 0 00-1.813 0l-1.598 1.304a1.284 1.284 0 000 1.803 1.324 1.324 0 001.804 0zM392.024 748.489l52.351 3.92c16.856 1.264 33.712 2.695 50.617 1.724 16.337-.931 32.536-2.94 48.932-2.94 11.27 0 25.97.765 33.124-9.8 2.077-3.057-2.323-5.88-4.822-3.733-10.427 8.82-24.814 6.438-37.534 6.86-15.513.499-30.909 2.763-46.423 3.253-15.934.5-31.869-.803-47.765-1.813l-48.48-3.067c-3.577-.226-3.538 5.282 0 5.547v.049zM552.684 785.092c-2.312 9.447-10.162 12.74-18.62 15.17-2.401.686-2.822 4.9 0 5.292 11.457 1.715 21.129-8.82 23.52-19.1.755-3.205-4.155-4.577-4.9-1.362zM444.58 772.685c-2.322 11.632-5.262 23.52-16.964 28.851-3.155 1.45-.921 6.713 2.372 5.615 14.024-4.664 17.366-20.305 19.228-33.192.431-2.94-4.018-4.371-4.636-1.274z"
      ></path>
      <path
        fill="#232323"
        d="M34.5 813.433c92.924.764 185.877.441 278.81.49 92.933.049 185.877.108 278.81.186 52.175 0 104.35.324 156.526 0 4.566 0 4.566-7.066 0-7.085-92.934-.51-185.877.068-278.81.127-92.934.059-185.877.118-278.81.245-52.176.069-104.35-.088-156.526.343-3.636 0-3.645 5.625 0 5.655v.039zM604.644 691.158c-3.636-9.702-8.673-27.44 5.469-31.526 14.572-4.175 14.905 21.168 12.142 29.302l3.92.519c-.275-6.252 4.145-11.672 10.133-13.347 6.399-1.794 12.74 1.558 16.337 6.86 7.644 11.152 1.46 24.911-8.252 32.389a2.038 2.038 0 002.048 3.518c6.311-3.166 14.7.5 16.984 7.164 2.499 7.252-1.745 14.915-7.84 18.757a2.097 2.097 0 001.607 3.812c9.859-2.136 21.001 4.43 22.922 14.622 1.921 10.192-6.056 20.227-15.984 22.01-2.626.481-1.509 4.469 1.108 4.009 12.22-2.137 21.501-14.759 18.943-27.146-2.558-12.388-15.984-20.188-28.097-17.523l1.608 3.812c8.124-5.125 13.367-15.768 9.045-25.078-3.851-8.281-14.21-12.024-22.324-7.957l2.048 3.518c12.661-9.8 19.6-28.773 6.732-41.523-5.135-5.076-12.563-7.203-19.413-4.567-6.851 2.637-11.947 9.154-11.555 16.66a1.978 1.978 0 003.92.53c3.293-10.486 1.843-35.986-14.572-34.193-5.733.637-10.78 5.165-12.887 10.428-3.332 8.467.264 17.738 3.332 25.685.637 1.657 3.332.98 2.695-.744l-.069.009zM603.076 767.079c1.823-3.479 7.213-7.124 10.917-3.92 2.284 1.96 2.313 7.027-.891 8.075-2.107.706-1.255 3.92.98 3.362 5.791-1.578 6.713-9.536 2.832-13.554-5.135-5.311-13.72-1.195-16.543 4.459-.911 1.823 1.794 3.44 2.754 1.608l-.049-.03zM105.638 725.233a58.037 58.037 0 00-11.28-21.393c-3.92-4.616-10.956-12.328-17.865-9.692-16.601 6.34 13.014 31.85 17.473 36.26l1.96-3.342c-6.654-2.44-15.239-.735-18.62 6.096-2.826 5.794-.61 12.786 5.038 15.895l.5-3.802c-7.84 1.097-20.267 5.36-17.347 15.739 3.548 12.583 19.277 8.682 27.578 4.635 1.96-.98.568-4.371-1.5-3.567-5.88 2.293-20.796 7.752-22.09-3.146-.842-7.056 9.38-8.918 14.456-9.653 1.784-.255 1.96-3.028.5-3.793a7.928 7.928 0 01-2.803-11.534c3.028-4.224 8.643-4.645 13.2-3.019 1.96.696 3.313-1.96 1.96-3.332a414.054 414.054 0 01-14.21-14.543 33.618 33.618 0 01-5.34-6.674c-2.127-3.92-3-10.603 4.459-8.584 5.34 1.44 10.339 7.84 13.425 12.181a52.8 52.8 0 017.743 16.033 1.432 1.432 0 102.763-.765zM613.121 345.601a606.38 606.38 0 0136.986-32.115c1.489-1.185-.618-3.273-2.088-2.087a604.433 604.433 0 00-36.887 32.222c-1.313 1.245.676 3.225 1.96 1.96l.029.02zM678.183 497.06a65.925 65.925 0 0038.043 5.331c1.96-.324 1.118-3.264-.823-2.989a65.14 65.14 0 01-35.789-4.792c-1.657-.726-3.107 1.695-1.431 2.45zM673.302 522.285a11.283 11.283 0 0011.016-.137c1.715-.98.176-3.587-1.529-2.617a8.819 8.819 0 01-8.075.333c-1.608-.705-3.019 1.519-1.412 2.421z"
      ></path>
    </Box>
  );
}

export default LetterboxIllustration;
